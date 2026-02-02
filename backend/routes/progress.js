const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Progress = require('../models/Progress');
const Task = require('../models/Task');

// All routes are protected
router.use(authMiddleware);

// @route   GET /api/progress
// @desc    Get progress data for a date range
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { userId: req.userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const progressData = await Progress.find(query)
      .populate('taskId', 'name category')
      .sort({ date: 1 });

    res.json({
      success: true,
      count: progressData.length,
      data: progressData
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching progress data',
      error: error.message 
    });
  }
});

// @route   POST /api/progress
// @desc    Update task completion status for a date
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { taskId, date, completed, notes } = req.body;

    if (!taskId || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Task ID and date are required' 
      });
    }

    // Verify task belongs to user
    const task = await Task.findOne({ _id: taskId, userId: req.userId });
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    // Normalize date to start of day
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Update or create progress entry
    let progress = await Progress.findOneAndUpdate(
      { userId: req.userId, taskId, date: normalizedDate },
      { completed, notes },
      { new: true, upsert: true }
    ).populate('taskId', 'name category');

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating progress',
      error: error.message 
    });
  }
});

// @route   GET /api/progress/report/:year/:month
// @desc    Generate monthly report with statistics
// @access  Private
router.get('/report/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;

    // Calculate date range for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get all progress data for the month
    const progressData = await Progress.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate }
    }).populate('taskId', 'name category');

    // Get all user tasks
    const tasks = await Task.find({ userId: req.userId, isActive: true });

    // Calculate statistics per task
    const taskStats = {};
    tasks.forEach(task => {
      taskStats[task._id] = {
        taskName: task.name,
        category: task.category,
        totalDays: 0,
        completedDays: 0,
        completionRate: 0,
        dates: []
      };
    });

    // Process progress data
    progressData.forEach(progress => {
      const taskId = progress.taskId._id.toString();
      if (taskStats[taskId]) {
        taskStats[taskId].totalDays++;
        if (progress.completed) {
          taskStats[taskId].completedDays++;
        }
        taskStats[taskId].dates.push({
          date: progress.date,
          completed: progress.completed,
          notes: progress.notes
        });
      }
    });

    // Calculate completion rates
    Object.keys(taskStats).forEach(taskId => {
      const stats = taskStats[taskId];
      if (stats.totalDays > 0) {
        stats.completionRate = ((stats.completedDays / stats.totalDays) * 100).toFixed(2);
      }
    });

    // Overall statistics
    const totalTasks = tasks.length;
    const totalEntries = progressData.length;
    const completedEntries = progressData.filter(p => p.completed).length;
    const overallCompletionRate = totalEntries > 0 
      ? ((completedEntries / totalEntries) * 100).toFixed(2) 
      : 0;

    res.json({
      success: true,
      data: {
        month: `${year}-${String(month).padStart(2, '0')}`,
        summary: {
          totalTasks,
          totalEntries,
          completedEntries,
          overallCompletionRate: parseFloat(overallCompletionRate)
        },
        taskStats: Object.values(taskStats).map(stat => ({
          ...stat,
          completionRate: parseFloat(stat.completionRate)
        }))
      }
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating report',
      error: error.message 
    });
  }
});

module.exports = router;

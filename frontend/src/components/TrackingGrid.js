import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays } from 'date-fns';
import './TrackingGrid.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const TrackingGrid = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(false);

  // Get dates for the current view (15 days from selected date)
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 15; i++) {
      dates.push(addDays(selectedDate, i));
    }
    return dates;
  };

  const dates = getDates();

  useEffect(() => {
    if (tasks.length > 0) {
      fetchProgressData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, tasks]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const startDate = format(dates[0], 'yyyy-MM-dd');
      const endDate = format(dates[dates.length - 1], 'yyyy-MM-dd');
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/api/progress`, {
        params: { startDate, endDate },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Convert array to object for easy lookup
        const dataMap = {};
        response.data.data.forEach(item => {
          const key = `${item.taskId._id}-${format(new Date(item.date), 'yyyy-MM-dd')}`;
          dataMap[key] = item.completed;
        });
        setProgressData(dataMap);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
    setLoading(false);
  };

  const handleCheckboxChange = async (taskId, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const key = `${taskId}-${dateStr}`;
    const currentValue = progressData[key] || false;

    // Optimistic update
    setProgressData({
      ...progressData,
      [key]: !currentValue
    });

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/progress`, {
        taskId,
        date: dateStr,
        completed: !currentValue
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      // Revert on error
      setProgressData({
        ...progressData,
        [key]: currentValue
      });
      alert('Failed to update progress. Please try again.');
    }
  };

  const goToPreviousWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const goToNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  if (tasks.length === 0) {
    return (
      <div className="tracking-empty">
        <h2>No tasks yet!</h2>
        <p>Go to "Manage Tasks" tab to add your first task.</p>
      </div>
    );
  }

  return (
    <div className="tracking-grid-container">
      <div className="tracking-header">
        <h2>Daily Progress Tracker</h2>
        <div className="date-navigation">
          <button onClick={goToPreviousWeek} className="btn-nav">← Previous</button>
          <button onClick={goToToday} className="btn-today">Today</button>
          <button onClick={goToNextWeek} className="btn-nav">Next →</button>
        </div>
      </div>

      <div className="grid-wrapper">
        <div className="grid-scroll">
          <table className="tracking-table">
            <thead>
              <tr>
                <th className="task-column">Task</th>
                {dates.map((date, index) => (
                  <th key={index} className="date-column">
                    <div className="date-header">
                      <div className="date-day">{format(date, 'EEE')}</div>
                      <div className="date-number">{format(date, 'dd-MM-yy')}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="task-name">
                    <div className="task-info">
                      <span className="task-title">{task.name}</span>
                      {task.category && (
                        <span className="task-category">{task.category}</span>
                      )}
                    </div>
                  </td>
                  {dates.map((date, index) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const key = `${task._id}-${dateStr}`;
                    const isChecked = progressData[key] || false;
                    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                    return (
                      <td key={index} className={`checkbox-cell ${isToday ? 'today' : ''}`}>
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(task._id, date)}
                            disabled={loading}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrackingGrid;

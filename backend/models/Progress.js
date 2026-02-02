const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  }
}, {
  timestamps: true
});

// Compound unique index to prevent duplicate entries for same task on same date
ProgressSchema.index({ userId: 1, taskId: 1, date: 1 }, { unique: true });

// Index for efficient date range queries
ProgressSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Progress', ProgressSchema);

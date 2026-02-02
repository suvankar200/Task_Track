import React, { useState } from 'react';
import axios from 'axios';
import './TaskManager.css';

const TaskManager = ({ tasks, onTasksUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/tasks', formData);
      if (response.data.success) {
        setFormData({ name: '', description: '', category: '' });
        setShowForm(false);
        onTasksUpdate();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create task');
    }
    setLoading(false);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        onTasksUpdate();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className="task-manager">
      <div className="task-manager-header">
        <h2>Manage Your Tasks</h2>
        <button
          className="btn-add-task"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add New Task'}
        </button>
      </div>

      {showForm && (
        <div className="task-form-card">
          <h3>Create New Task</h3>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Task Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., DSA Practice, Quizzes, Project Work"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Optional: Add details about this task"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Learning, Work, Personal"
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </div>
      )}

      <div className="tasks-list">
        <h3>Your Tasks ({tasks.length})</h3>
        
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Click "Add New Task" to get started!</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <div className="task-card-header">
                  <h4>{task.name}</h4>
                  {task.category && (
                    <span className="badge">{task.category}</span>
                  )}
                </div>
                
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                
                <div className="task-card-footer">
                  <span className="task-date">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(task._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;

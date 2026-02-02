import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Report.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Report = ({ tasks }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tasks.length > 0) {
      fetchReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, tasks]);

  const fetchReport = async () => {
    setLoading(true);
    setError('');

    try {
      const [year, month] = selectedMonth.split('-');
      const response = await axios.get(`/api/progress/report/${year}/${month}`);
      
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      setError('Failed to generate report');
      console.error('Error fetching report:', error);
    }
    setLoading(false);
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    
    // Generate last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    
    return options;
  };

  if (tasks.length === 0) {
    return (
      <div className="report-empty">
        <h2>No tasks to report</h2>
        <p>Add tasks and track your progress to generate reports!</p>
      </div>
    );
  }

  if (loading) {
    return <div className="report-loading">Loading report...</div>;
  }

  if (error) {
    return <div className="report-error">{error}</div>;
  }

  if (!reportData) {
    return null;
  }

  // Prepare chart data
  const taskNames = reportData.taskStats.map(stat => stat.taskName);
  const completionRates = reportData.taskStats.map(stat => stat.completionRate);
  const completedDays = reportData.taskStats.map(stat => stat.completedDays);
  const totalDays = reportData.taskStats.map(stat => stat.totalDays);

  const barChartData = {
    labels: taskNames,
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: completionRates,
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        borderRadius: 6
      }
    ]
  };

  const lineChartData = {
    labels: taskNames,
    datasets: [
      {
        label: 'Completed Days',
        data: completedDays,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Total Days Tracked',
        data: totalDays,
        borderColor: 'rgb(118, 75, 162)',
        backgroundColor: 'rgba(118, 75, 162, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const doughnutData = {
    labels: ['Completed', 'Not Completed'],
    datasets: [
      {
        data: [
          reportData.summary.completedEntries,
          reportData.summary.totalEntries - reportData.summary.completedEntries
        ],
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(102, 126, 234, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Monthly Performance Report</h2>
        <div className="month-selector">
          <label>Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {getMonthOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">📋</div>
          <div className="summary-content">
            <h3>{reportData.summary.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <h3>{reportData.summary.completedEntries}</h3>
            <p>Completed Days</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <h3>{reportData.summary.totalEntries}</h3>
            <p>Total Entries</p>
          </div>
        </div>

        <div className="summary-card highlight">
          <div className="summary-icon">🎯</div>
          <div className="summary-content">
            <h3>{reportData.summary.overallCompletionRate}%</h3>
            <p>Overall Completion</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Task Completion Rates</h3>
          <div className="chart-wrapper">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Overall Progress</h3>
          <div className="chart-wrapper doughnut">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>Completed vs Total Days</h3>
          <div className="chart-wrapper">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Task Stats */}
      <div className="task-stats-table">
        <h3>Detailed Task Statistics</h3>
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Category</th>
              <th>Days Tracked</th>
              <th>Days Completed</th>
              <th>Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {reportData.taskStats.map((stat, index) => (
              <tr key={index}>
                <td><strong>{stat.taskName}</strong></td>
                <td><span className="category-badge">{stat.category || 'General'}</span></td>
                <td>{stat.totalDays}</td>
                <td>{stat.completedDays}</td>
                <td>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${stat.completionRate}%` }}
                    >
                      <span className="progress-text">{stat.completionRate}%</span>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;

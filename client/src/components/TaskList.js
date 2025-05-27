import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../api';
import { scheduleNotification } from '../utils/schedular';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
    res.data.forEach(task => scheduleNotification(task));
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  const loadTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error('❌ Failed to load tasks:', err);
    }
  };

  loadTasks();
}, []);


  return (
    <div className="card p-3 shadow-sm">
      <h4>Your Tasks</h4>
      <ul className="list-group">
        {tasks.map(task => (
          <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{task.title}</strong><br />
              <small>{new Date(task.date).toLocaleString()}</small>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

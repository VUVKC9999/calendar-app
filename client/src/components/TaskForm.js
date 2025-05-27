import React, { useState } from 'react';
import { addTask } from '../api';

const TaskForm = ({ onTaskAdded }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    reminderTime: 5,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTask(form);
    onTaskAdded();
    setForm({ title: '', description: '', date: '', reminderTime: 5 });
  };

  return (
    <div className="card p-3 shadow-sm">
      <h4>Add New Task</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <input className="form-control" name="title" placeholder="Title" onChange={handleChange} value={form.title} required />
        </div>
        <div className="mb-2">
          <input className="form-control" name="description" placeholder="Description" onChange={handleChange} value={form.description} />
        </div>
        <div className="mb-2">
          <input className="form-control" type="datetime-local" name="date" onChange={handleChange} value={form.date} required />
        </div>
        <div className="mb-3">
          <input className="form-control" type="number" name="reminderTime" placeholder="Reminder (minutes before)" onChange={handleChange} value={form.reminderTime} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;

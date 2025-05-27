import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getTasks } from '../api';
import { format } from 'date-fns';

const TaskCalendar = () => {
  const [value, setValue] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      const res = await getTasks();
      setTasks(res.data);
    };
    loadTasks();
  }, []);

  const tasksOnDate = tasks.filter(task =>
    format(new Date(task.date), 'yyyy-MM-dd') === format(value, 'yyyy-MM-dd')
  );

  return (
    <div className="card p-3 shadow-sm">
      <h4>Calendar View</h4>
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={({ date }) => {
          const dateString = format(date, 'yyyy-MM-dd');
          return tasks.some(task => format(new Date(task.date), 'yyyy-MM-dd') === dateString)
            ? 'bg-info text-white rounded'
            : null;
        }}
      />
      <div className="mt-3">
        <h6>Tasks on {format(value, 'PPP')}:</h6>
        {tasksOnDate.length === 0 ? (
          <p className="text-muted">No tasks</p>
        ) : (
          <ul className="list-group">
            {tasksOnDate.map(task => (
              <li key={task._id} className="list-group-item">
                <strong>{task.title}</strong><br />
                <small>{new Date(task.date).toLocaleTimeString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskCalendar;

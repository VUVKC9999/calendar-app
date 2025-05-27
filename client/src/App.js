import React, { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskCalendar from './components/TaskCalendar';
import Login from './components/Login'; 
import Signup from './components/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const reload = () => setRefresh(!refresh);

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    setIsLoggedIn(true);
  }
}, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return showSignup ? (
      <Signup onSignup={() => setIsLoggedIn(true)} />
    ) : (
      <>
        <Login onLogin={() => setIsLoggedIn(true)} />
        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={() => setShowSignup(true)}>
            Don't have an account? Sign up
          </button>
        </div>
      </>
    );
  }


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>📅 My Personal Calendar</h1>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <div className="row">
        <div className="col-md-6">
          <TaskForm onTaskAdded={reload} />
          <TaskCalendar key={refresh} />
        </div>
        <div className="col-md-6">
          <TaskList key={refresh} />
        </div>
      </div>
    </div>
  );
}

export default App;

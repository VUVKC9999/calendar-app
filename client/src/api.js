import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

export const getTasks = () => API.get('/tasks');
export const addTask = (task) => API.post('/tasks', task);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
export const toggleComplete = (id) => API.patch(`/tasks/complete/${id}`);


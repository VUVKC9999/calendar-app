import axios from './utils/axios';

export const getTasks = () => axios.get('/tasks');
export const addTask = (task) => axios.post('/tasks', task);
export const deleteTask = (id) => axios.delete(`/tasks/${id}`);
export const toggleComplete = (id) => axios.patch(`/tasks/complete/${id}`);


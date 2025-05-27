import React, { useState } from 'react';
import axios from 'axios';

// ✅ Use environment-based base URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

function Signup({ onSignup }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Register
      await API.post('/auth/register', form);

      // ✅ Auto-login
      const res = await API.post('/auth/login', {
        email: form.email,
        password: form.password
      });

      localStorage.setItem('token', res.data.token);
      onSignup();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Signup failed.';
      alert(errorMsg);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          className="form-control mb-3"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          className="form-control mb-3"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn btn-success w-100" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Signup;

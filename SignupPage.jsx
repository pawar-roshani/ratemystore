// SignupPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.length < 20 || formData.name.length > 60) {
      return setError('Name must be between 20 and 60 characters');
    }
    if (formData.address.length > 400) {
      return setError('Address too long');
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(formData.password)) {
      return setError('Password must be 8-16 characters, with 1 uppercase and 1 special character');
    }

    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border" required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" required />
        <input name="address" placeholder="Address" onChange={handleChange} className="w-full p-2 border" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border" required />
        <select name="role" onChange={handleChange} className="w-full p-2 border">
          <option value="user">User</option>
          <option value="owner">Store Owner</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full p-2 bg-green-600 text-white">Register</button>
      </form>
    </div>
  );
};

export default SignupPage;

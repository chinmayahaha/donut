import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    const newFormData = { ...formData };
    newFormData[field] = field === 'password' ? 'passwordInput' : 'text';
    setFormData(newFormData);
  };

  const validateForm = () => {
    let validationErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      validationErrors.name = 'Name is required and must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      validationErrors.email = 'Email is required and must be in a valid format.';
    }

    if (!formData.password || formData.password.length < 8) {
      validationErrors.password = 'Password is required and must be at least 8 characters.';
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); 
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://donut-wd2v.onrender.com/api/auth/register', formData);
      
      localStorage.setItem('token', response.data.accesstoken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'An error occurred during registration.';
      setErrors({ generalError: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      {errors.generalError && <p className="text-red-500 mb-4">{errors.generalError}</p>}
      <h2 className="text-xl font-bold text-center mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          />
          {errors.name && <p className="text-red-500 text-sm pt-1">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm pt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm mb-2">Password</label>
          <div className="flex relative">
            <input
              type={formData.password === 'password' ? 'password' : 'text'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            />
            <button onClick={() => togglePasswordVisibility('password')} type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-0 text-gray-500 hover:text-gray-700">
              {formData.password === 'password' ? 'Show' : 'Hide'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm pt-1">{errors.password}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm mb-2">Confirm Password</label>
          <div className="flex relative">
            <input
              type={formData.confirmPassword === 'password' ? 'password' : 'text'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
            />
            <button onClick={() => togglePasswordVisibility('confirmPassword')} type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-0 text-gray-500 hover:text-gray-700">
              {formData.confirmPassword === 'password' ? 'Show' : 'Hide'}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm pt-1">{errors.confirmPassword}</p>}
        </div>
        <div className="mt-4">
          <button type="submit" disabled={loading} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full ${loading && 'opacity-75 cursor-not-allowed'}`}>{loading ? 'Loading...' : 'Sign Up'}</button>
        </div>
      </form>
      <p className="text-center mt-8">
        Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>.
      </p>
    </div>
  );
};

export default SignupForm;

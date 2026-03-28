
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onSuccess, redirectPath = '/dashboard', showSignupLink = true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleInputChange = ({ target }) => {
    if (target.name === 'email') setEmail(target.value);
    else if (target.name === 'password') setPassword(target.value);
    setValidationErrors({});
    setError(null);
  };

  const togglePasswordVisibility = () => {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const validationErrors = {};

    if (!email) validationErrors.email = 'Email is required';
    if (!password) validationErrors.password = 'Password is required';

    setValidationErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error === 'Invalid credentials' || data.error === 'User not found') setError('Invalid email or password');
        else if (data.error === 'Server error') setError('Server error. Please try again later.');
        return;
      }

      const { token, user } = await response.json();

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (onSuccess) onSuccess(user);
      navigate(redirectPath);
    } catch (error) {
      setError('Unable to connect. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p role="alert" className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleInputChange}
              required={true}
              autoComplete="email"
              className={`mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {validationErrors.email && <p className="text-red-600 text-xs mt-1">{validationErrors.email}</p>}
          </div>
          <div className="mt-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative flex items-center mt-1 rounded-md shadow-sm focus-within:ring-blue-500 focus-within::ring-offset-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleInputChange}
                required={true}
                autoComplete="current-password"
                className={`block w-full pr-12 border-gray-300 rounded-md shadow-sm focus:outline-none placeholder-gray-400 sm:text-sm`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" onClick={togglePasswordVisibility} className="-mr-1">
                  {/* SVG for eye icon */}
                  {password ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            {validationErrors.password && <p className="text-red-600 text-xs mt-1">{validationErrors.password}</p>}
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v1m4 0a6 6 0 01-1.397 5.753L10 14l-7 3m14 0a6 6 0 001.397-5.753L22 14l-7-3z" />
                  </svg>
                  Loading...
                </>
              ) : 'Login'}
            </button>
          </div>
        </form>
        {showSignupLink && (
          <p className="mt-6 text-center">
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Don't have an account? Sign Up
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;

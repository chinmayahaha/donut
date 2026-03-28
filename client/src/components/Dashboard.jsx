
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [navigate, user]);

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="bg-white shadow-lg w-64">
        <ul>
          <li className="mb-2 px-4 hover:bg-gray-100">
            <a href="#" className="text-gray-500 hover:text-gray-800 block px-4 py-2 text-sm">Dashboard</a>
          </li>
          <li className="mb-2 px-4 hover:bg-gray-100">
            <a href="#" className="text-gray-500 hover:text-gray-800 block px-4 py-2 text-sm">Projects</a>
          </li>
          <li className="mb-2 px-4 hover:bg-gray-100">
            <a href="#" className="text-gray-500 hover:text-gray-800 block px-4 py-2 text-sm">Subscriptions</a>
          </li>
          <li className="mb-2 px-4 hover:bg-gray-100">
            <a href="#" className="text-gray-500 hover:text-gray-800 block px-4 py-2 text-sm">Settings</a>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col flex-1">
        <header className="bg-white shadow-lg p-4 border-b">
          <h1 className="text-lg font-medium">{user ? `Welcome, ${user.name}` : 'Welcome!'}</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
          <div className="bg-white shadow-lg p-4 rounded-lg">
            <h2>Total Projects</h2>
            <p>0</p>
          </div>
          <div className="bg-white shadow-lg p-4 rounded-lg">
            <h2>Active Subscription</h2>
            <p>$0.00</p>
          </div>
          <div className="bg-white shadow-lg p-4 rounded-lg">
            <h2>Member Since</h2>
            <p>Jan 1, 2023</p>
          </div>
        </div>

        <div className="flex flex-col p-4 border-t overflow-y-auto h-full">
          <table className="w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State */}
              <tr className="bg-white">
                <td colSpan="2" className="py-4 px-6 text-center whitespace-no-wrap">
                  No projects found.
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-auto p-4 flex justify-end">
            <button onClick={logout} className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded text-white">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

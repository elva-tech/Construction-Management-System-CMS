import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ElvaLogo from '../Components/ElvaLogo';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State for username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submitted!');

  try {
    await login(); // 🔥 ONLY THIS
  } catch (error) {
    setError('Login failed');
  }
};
  return (
    <div className="min-h-screen bg-[#1e2c3d] px-4 flex flex-col">
      {/* Logo at the very top center */}
      <div className="w-full flex justify-center mt-0 mb-4">
        <ElvaLogo className="w-72" />
      </div>
      {/* Login Form directly below logo */}
      <div className="w-full max-w-md mx-auto mt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Login</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm text-white mb-2 uppercase tracking-wider font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full bg-transparent border-b border-gray-400 px-0 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white [&::placeholder]:text-gray-400 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-2 uppercase tracking-wider font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full bg-transparent border-b border-gray-400 px-0 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white [&::placeholder]:text-gray-400 disabled:opacity-50"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-100 text-[#1e2c3d] py-3 rounded-md transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-400/30">
          <h3 className="text-white font-medium mb-2">User Management</h3>
          <p className="text-gray-300 text-sm">
            Supervisors and clients are managed through the Projects page.
            Use "Add User" to create accounts for project supervisors and clients.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

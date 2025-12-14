import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Attempting login for:', email);
      
      // Use the api instance from api.js (which has the correct Render URL)
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const data = response.data;

      // DEBUG: Log the response
      console.log('✅ Login response:', data);
      console.log('👤 User role:', data.user?.role);
      
      // Clear all storage
      sessionStorage.clear();
      localStorage.clear();
      
      // Store token and user data
      sessionStorage.setItem('token', data.token);
      localStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on role
      if (data.user.role === 'superadmin') {
        console.log('🔱 SuperAdmin detected - redirecting to /superadmin');
        localStorage.setItem('superAdminToken', data.token);
        sessionStorage.setItem('superAdminToken', data.token);
        window.location.href = '/superadmin';
      } else if (data.user.role === 'admin') {
        console.log('👨‍💼 Admin detected - redirecting to /admin');
        localStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminToken', data.token);
        window.location.href = '/admin';
      } else {
        console.log('👤 Regular user - redirecting to /dashboard');
        window.location.href = '/dashboard';
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      
      // Handle different error types
      if (err.response) {
        // Server responded with an error
        const message = err.response.data?.message || 'Invalid email or password';
        setError(message);
        console.error('Server error:', err.response.status, message);
      } else if (err.request) {
        // Request was made but no response received
        setError('Network error. Please check your connection or try again later.');
        console.error('Network error - no response received');
      } else {
        // Something else happened
        setError('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4/12">
        <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-10">
            <a href="/">
              <div className="w-20 h-20 bg-gradient-to-br from-[#f80759] to-[#bc4e9c] rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <span className="text-white text-3xl font-bold">EA</span>
              </div>
            </a>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-lg">Login to your account</p>
          </div>

          {error && (
            <div className="mb-7 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-7" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base placeholder-gray-500 bg-gray-50 hover:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 pr-13 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base placeholder-gray-500 bg-gray-50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-t from-[#f80759] to-[#bc4e9c] text-white py-3.5 rounded-lg font-bold text-base hover:from-[#a3053a] hover:to-[#6c2d5a] transition-all shadow-lg hover:shadow-xl ${
                loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-200 pt-5">
            <p className="text-gray-700 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-[#f80759] hover:text-[#bc4e9c] font-bold underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
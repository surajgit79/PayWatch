import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { EnvelopeIcon, LockClosedIcon, ChartBarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { signInWithGoogle } from '../firebase';
import { authAPI } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const { login, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();
      
      const response = await authAPI.googleLogin({ id_token: idToken });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const features = [
    'Track dollar cards & subscriptions',
    'Real-time USD to NPR conversion',
    'Smart alerts & reminders',
    'Beautiful analytics & reports'
  ];

  return (
    <div className="min-h-screen flex">
      
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-12 text-white relative overflow-hidden">
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col justify-between w-full">
          
          {/* Logo and Title */}
          <div>
            <div className="flex items-center gap-4 mb-8 animate-slide-down">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30">
                <ChartBarIcon className="w-9 h-9 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold">PayWatch</h1>
                <p className="text-primary-100">Your Financial Companion</p>
              </div>
            </div>

            <div className="space-y-6 mt-16 animate-fade-in">
              <h2 className="text-5xl font-display font-bold leading-tight">
                Manage Your<br />
                Finances<br />
                Effortlessly
              </h2>
              <p className="text-xl text-primary-100 max-w-md">
                Take control of your dollar cards and subscriptions with intelligent tracking and insights.
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4 animate-slide-up">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 text-primary-50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircleIcon className="w-6 h-6 text-primary-300 flex-shrink-0" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-secondary-50">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-slide-down">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-xl mb-4">
              <ChartBarIcon className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold gradient-text">PayWatch</h1>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left animate-slide-up">
            <h2 className="text-3xl font-bold text-secondary-900 mb-2">
              Welcome Back! 👋
            </h2>
            <p className="text-secondary-600">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Login Card */}
          <div className="card p-8 animate-scale-in">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {error && (
                <div className="bg-danger-50 border-2 border-danger-200 text-danger-700 px-4 py-3 rounded-xl animate-fade-in flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-semibold">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-secondary-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input pl-11"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-secondary-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input pl-11"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full btn-secondary py-3.5 text-base font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {googleLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-secondary-600 border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-secondary-500">New to PayWatch?</span>
                </div>
              </div>

              <Link 
                to="/register" 
                className="block w-full text-center px-6 py-3 bg-secondary-100 text-secondary-700 rounded-xl hover:bg-secondary-200 transition-all duration-300 font-bold border-2 border-secondary-200 hover:border-secondary-300"
              >
                Create an Account
              </Link>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-secondary-500 animate-fade-in">
            © 2026 PayWatch. Secure & reliable financial management.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
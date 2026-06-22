import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { ROUTES } from '../shared/constants/routes.js';
import Input from '../shared/components/Input.jsx';
import Button from '../shared/components/Button.jsx';
import Card from '../shared/components/Card.jsx';
import { Mail, Lock, Eye, EyeOff, Cpu, AlertTriangle } from 'lucide-react';

const LoginPage = () => {
  const { login, error, clearError, loading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const onSubmit = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 animate-fade-in relative z-10">
        <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-600">
          <Cpu className="h-7 w-7" />
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
          MockAI
        </span>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md relative z-10 shadow-md border-slate-200" title="Welcome Back" subtitle="Log in to start practicing mock interviews">
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-150 flex items-start gap-2.5 text-rose-600 text-xs animate-in fade-in duration-255">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            id="email"
            placeholder="you@example.com"
            required
            icon={Mail}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />

          <div className="relative">
            <Input
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              icon={Lock}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-slate-450 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={loading}
          >
            Log In
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER} className="text-indigo-600 hover:text-indigo-500 hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

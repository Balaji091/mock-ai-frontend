import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  isLoading = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/20 focus:ring-indigo-500',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 focus:ring-slate-500',
    accent: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-blue-500/20 focus:ring-blue-500',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-emerald-500/20 focus:ring-emerald-500',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md hover:shadow-rose-500/20 focus:ring-rose-500',
    outline: 'border border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 text-slate-300 focus:ring-slate-500',
    ghost: 'hover:bg-slate-800/80 text-slate-300 hover:text-slate-100 focus:ring-slate-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="-ml-1 mr-2 h-4.5 w-4.5 text-current" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;

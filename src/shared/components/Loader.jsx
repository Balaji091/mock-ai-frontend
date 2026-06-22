import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-indigo-600 border-r-indigo-600 border-b-transparent border-l-transparent ${sizeClasses[size]} ${className}`}
    />
  );
};

const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute h-24 w-24 rounded-full bg-indigo-500/5 blur-xl animate-pulse" />
        <Spinner size="lg" />
      </div>
      <p className="text-slate-600 text-xs font-bold tracking-wider uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};

const CardSkeleton = () => {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-4 animate-pulse shadow-sm">
      <div className="h-4 bg-slate-100 rounded w-1/3" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
      </div>
      <div className="h-8 bg-slate-100 rounded w-24 mt-2" />
    </div>
  );
};

const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 space-y-3 animate-pulse shadow-sm">
      <div className="h-6 bg-slate-100 rounded w-full mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-4 bg-slate-50 rounded flex-1" />
          <div className="h-4 bg-slate-55 rounded flex-1" />
          <div className="h-4 bg-slate-50 rounded flex-1" />
          <div className="h-4 bg-slate-100 rounded w-20" />
        </div>
      ))}
    </div>
  );
};

export { Spinner, FullPageLoader, CardSkeleton, TableSkeleton };

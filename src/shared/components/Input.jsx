import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      id,
      error,
      className = '',
      placeholder,
      required = false,
      helperText,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-4.5 w-4.5" />
            </div>
          )}
          <input
            id={id}
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`w-full rounded-lg bg-white border ${
              error ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-350 focus:ring-indigo-500'
            } text-slate-800 placeholder-slate-450 ${
              Icon ? 'pl-10' : 'px-4'
            } py-2.5 text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-opacity-20 focus:bg-white ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-rose-500 font-medium" id={`${id}-error`}>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-xs text-slate-400 font-normal">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

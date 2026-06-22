import React from 'react';

const Card = ({
  children,
  className = '',
  hoverable = false,
  title,
  subtitle,
  headerAction,
  footer,
  ...props
}) => {
  return (
    <div
      className={`rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm ${
        hoverable ? 'transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:translate-y-[-1px]' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            {title && <h3 className="font-semibold text-slate-800 text-base">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-550 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button.jsx';

const EmptyState = ({
  title = 'No records found',
  description = 'There are no items to show at the moment.',
  icon: Icon = HelpCircle,
  actionText,
  onActionClick,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl bg-slate-900/20 border border-slate-800/80 glass-card ${className}`}
    >
      <div className="p-3 bg-slate-900/60 rounded-full border border-slate-850 text-indigo-400 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onActionClick && (
        <Button onClick={onActionClick} size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

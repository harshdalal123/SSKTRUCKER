import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>}
      <div className="relative group">
        <input
          className={`
            w-full 
            bg-white/5 
            border 
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-brand-500'} 
            rounded-xl 
            px-4 py-3 
            ${icon ? 'pl-10' : ''}
            text-white 
            placeholder-gray-500 
            outline-none 
            transition-all 
            duration-300
            focus:bg-white/10
            focus:shadow-[0_0_15px_rgba(45,212,191,0.1)]
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-400 transition-colors">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
};
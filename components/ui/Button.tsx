import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  loading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden rounded-xl font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-md";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const variants = {
    primary: "bg-gradient-to-r from-brand-600 to-brand-400 text-white hover:shadow-brand-500/40 border border-transparent",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-md",
    danger: "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5 shadow-none",
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${loading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10 pointer-events-none"></div>
    </button>
  );
};
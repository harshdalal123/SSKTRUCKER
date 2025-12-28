import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false, ...props }) => {
  return (
    <div 
      className={`
        glass-panel 
        rounded-2xl 
        p-4 
        border 
        border-white/10 
        shadow-lg
        transition-all duration-300
        ${hoverEffect ? 'hover:bg-white/5 hover:scale-[1.02] cursor-pointer hover:shadow-brand-500/20' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
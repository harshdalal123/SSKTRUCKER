import React from 'react';
import { UserRole } from '../types';
import { Users } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, setRole }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg hover:bg-white/20 transition-all"
      >
        <Users size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 flex flex-col gap-1 animate-in fade-in zoom-in duration-200">
          <p className="px-2 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Switch View</p>
          {(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((roleKey) => (
            <button
              key={roleKey}
              onClick={() => {
                setRole(UserRole[roleKey]);
                setIsOpen(false);
              }}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentRole === UserRole[roleKey] ? 'bg-brand-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
            >
              {UserRole[roleKey]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
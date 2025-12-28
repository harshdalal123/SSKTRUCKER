import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { UserRole } from './types';
import { CustomerPanel } from './views/CustomerPanel';
import { DriverPanel } from './views/DriverPanel';
import { FleetPanel } from './views/FleetPanel';
import { LoginScreen } from './views/LoginScreen';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session on load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Retrieve role from metadata
        const userRole = session.user.user_metadata?.role as UserRole;
        if (userRole) setRole(userRole);
      }
      setLoading(false);
    };

    checkSession();

    // 2. Listen for auth changes (Login, Logout, Auto-refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const userRole = session.user.user_metadata?.role as UserRole;
        if (userRole) setRole(userRole);
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (selectedRole: UserRole) => {
    // State is actually handled by onAuthStateChange, but we set it here for immediate UI feedback
    setRole(selectedRole);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-dark-bg flex flex-col items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-900/20 blur-[100px] animate-pulse"></div>
         <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-600 z-10 tracking-tighter">
            SSK<span className="text-white">TRUCKER</span>
         </h1>
         <div className="mt-4 w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 animate-[width_2s_ease-in-out_infinite]" style={{ width: '30%' }}></div>
         </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="h-screen w-screen bg-dark-bg text-white overflow-hidden relative font-sans">
        
        <div className="h-full w-full animate-in fade-in duration-500">
          {!role ? (
            <LoginScreen onLoginSuccess={handleLoginSuccess} />
          ) : (
            <>
              {role === UserRole.CUSTOMER && <CustomerPanel onLogout={handleLogout} />}
              {role === UserRole.DRIVER && <DriverPanel onLogout={handleLogout} />}
              {role === UserRole.FLEET_OWNER && <FleetPanel onLogout={handleLogout} />}
            </>
          )}
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
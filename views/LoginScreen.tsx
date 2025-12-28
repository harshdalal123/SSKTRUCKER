import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserRole } from '../types';
import { Truck, Users, Package, ChevronRight, Mail, Lock, ArrowLeft, User, Phone } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole) => void;
}

type AuthMode = 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('SIGN_IN');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const roles = [
    { 
      id: UserRole.CUSTOMER, 
      label: 'Customer', 
      desc: 'Ship goods & track loads',
      icon: <Package size={32} className="text-brand-400" />,
      color: 'from-brand-500/20 to-brand-900/5' 
    },
    { 
      id: UserRole.DRIVER, 
      label: 'Truck Driver', 
      desc: 'Find loads & earn money',
      icon: <Truck size={32} className="text-orange-400" />,
      color: 'from-orange-500/20 to-orange-900/5'
    },
    { 
      id: UserRole.FLEET_OWNER, 
      label: 'Fleet Owner', 
      desc: 'Manage trucks & drivers',
      icon: <Users size={32} className="text-blue-400" />,
      color: 'from-blue-500/20 to-blue-900/5'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAuthMode('SIGN_IN');
    setError(null);
    setMessage(null);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setMessage(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (authMode === 'SIGN_IN') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Use the role from metadata if available, otherwise default to selected
        const userRole = data.user?.user_metadata?.role as UserRole || selectedRole;
        if (userRole) {
           onLoginSuccess(userRole);
        }

      } else if (authMode === 'SIGN_UP') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: selectedRole, // Important: Store role in metadata
            },
          },
        });

        if (error) throw error;
        setMessage('Account created! Please check your email to verify.');
        setAuthMode('SIGN_IN');

      } else if (authMode === 'FORGOT_PASSWORD') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });

        if (error) throw error;
        setMessage('Password reset link sent to your email.');
        setAuthMode('SIGN_IN');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 relative overflow-hidden bg-dark-bg">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-brand-500/10 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-500/10 rounded-full blur-[80px]"></div>
       </div>

       <div className="z-10 w-full max-w-md">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
             <h1 className="text-5xl font-black italic tracking-tighter text-white">
                SSK<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">TRUCKER</span>
             </h1>
             <p className="text-gray-400 text-lg">Next-Gen Logistics Platform</p>
          </div>

          {/* VIEW 1: ROLE SELECTION */}
          {!selectedRole && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <p className="text-center text-sm text-gray-500 mb-4 uppercase tracking-widest font-semibold">Select your account type</p>
               {roles.map(role => (
                 <GlassCard 
                   key={role.id} 
                   onClick={() => handleRoleSelect(role.id)}
                   className={`group cursor-pointer relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border-white/5`}
                 >
                   <div className={`absolute inset-0 bg-gradient-to-r ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                   <div className="relative flex items-center gap-4 p-2">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300">
                         {role.icon}
                      </div>
                      <div className="flex-1">
                         <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">{role.label}</h3>
                         <p className="text-sm text-gray-500 group-hover:text-gray-400">{role.desc}</p>
                      </div>
                      <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                   </div>
                 </GlassCard>
               ))}
            </div>
          )}

          {/* VIEW 2: AUTH FORMS */}
          {selectedRole && (
            <GlassCard className="animate-in fade-in zoom-in-95 duration-300 relative border-brand-500/20">
               <button onClick={handleBack} className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
               </button>

               <div className="mt-8 mb-6 text-center">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {authMode === 'SIGN_IN' && 'Welcome Back'}
                    {authMode === 'SIGN_UP' && 'Create Account'}
                    {authMode === 'FORGOT_PASSWORD' && 'Reset Password'}
                  </h2>
                  <p className="text-sm text-brand-400 font-medium uppercase tracking-wide">
                    {roles.find(r => r.id === selectedRole)?.label} Login
                  </p>
               </div>

               {error && (
                 <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center">
                   {error}
                 </div>
               )}
               
               {message && (
                 <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs text-center">
                   {message}
                 </div>
               )}

               <form onSubmit={handleAuth} className="space-y-4">
                  
                  {authMode === 'SIGN_UP' && (
                    <Input 
                      placeholder="Full Name" 
                      icon={<User size={18} />} 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  )}

                  <Input 
                    type="email" 
                    placeholder="Email Address" 
                    icon={<Mail size={18} />} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  {authMode !== 'FORGOT_PASSWORD' && (
                    <Input 
                      type="password" 
                      placeholder="Password" 
                      icon={<Lock size={18} />} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  )}

                  <Button type="submit" fullWidth loading={loading} className="mt-2">
                    {authMode === 'SIGN_IN' && 'Sign In'}
                    {authMode === 'SIGN_UP' && 'Create Account'}
                    {authMode === 'FORGOT_PASSWORD' && 'Send Reset Link'}
                  </Button>
               </form>

               <div className="mt-6 text-center space-y-2">
                  {authMode === 'SIGN_IN' && (
                    <>
                      <p className="text-xs text-gray-400">
                        Don't have an account? <button onClick={() => setAuthMode('SIGN_UP')} className="text-brand-400 hover:underline">Sign Up</button>
                      </p>
                      <button onClick={() => setAuthMode('FORGOT_PASSWORD')} className="text-xs text-gray-500 hover:text-white transition-colors">
                        Forgot Password?
                      </button>
                    </>
                  )}
                  
                  {(authMode === 'SIGN_UP' || authMode === 'FORGOT_PASSWORD') && (
                    <p className="text-xs text-gray-400">
                      Already have an account? <button onClick={() => setAuthMode('SIGN_IN')} className="text-brand-400 hover:underline">Sign In</button>
                    </p>
                  )}
               </div>

            </GlassCard>
          )}
          
          <div className="text-center pt-8">
             <p className="text-xs text-gray-600">© 2024 SSK Technologies • Secure Encrypted Connection</p>
          </div>
       </div>
    </div>
  );
};
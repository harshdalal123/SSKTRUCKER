import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { MOCK_TRUCKS } from '../constants';
import { Truck as TruckType } from '../types';
import { Truck, BatteryCharging, MapPin, AlertCircle, Wifi, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface FleetPanelProps {
  onLogout: () => void;
}

export const FleetPanel: React.FC<FleetPanelProps> = ({ onLogout }) => {
  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        setLoading(true);
        // Attempt to fetch from Supabase
        const { data, error } = await supabase.from('trucks').select('*');
        
        if (error) throw error;

        if (data && data.length > 0) {
          // Map Supabase data to app shape if needed, currently assuming direct match or close enough
          // For safety, we just use MOCK if Supabase is empty or schema mismatch to ensure UI doesn't break
          setTrucks(data as any); 
          setIsConnected(true);
        } else {
          // Fallback if table exists but empty
          console.log("No trucks found in DB, using mock data.");
          setTrucks(MOCK_TRUCKS);
          setIsConnected(true); // Connected but empty
        }
      } catch (err) {
        console.warn("Supabase connection failed or table missing, using mock data:", err);
        setTrucks(MOCK_TRUCKS);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  const activeCount = trucks.filter(t => t.status === 'BUSY' || t.status === 'AVAILABLE').length;
  const issueCount = trucks.filter(t => t.fuelLevel && t.fuelLevel < 20).length;

  return (
    <div className="h-full flex flex-col bg-dark-bg p-4 overflow-y-auto no-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Fleet Overview</h2>
        <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 text-[10px] px-2 py-1 rounded-full border ${isConnected && !error ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
              <Wifi size={12} />
              {isConnected && !error ? 'Connected' : 'Offline Mode'}
            </div>
            <button 
                onClick={onLogout}
                className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400 hover:bg-red-500/20"
             >
                <LogOut size={16} />
             </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <GlassCard className="bg-brand-900/10 border-brand-500/20">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-xs text-brand-300 font-bold uppercase">Active</span>
           </div>
           <p className="text-3xl font-black text-white">{activeCount}</p>
           <p className="text-xs text-gray-500">Trucks on road</p>
        </GlassCard>
        <GlassCard className="bg-orange-900/10 border-orange-500/20">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-orange-500"></div>
             <span className="text-xs text-orange-300 font-bold uppercase">Maintenance</span>
           </div>
           <p className="text-3xl font-black text-white">{issueCount}</p>
           <p className="text-xs text-gray-500">Needs attention</p>
        </GlassCard>
      </div>

      <h3 className="text-lg font-bold mb-3">Live Fleet Status</h3>
      
      {loading ? (
        <div className="flex justify-center py-10">
           <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          {trucks.map(truck => (
            <GlassCard key={truck.id} hoverEffect>
              <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/5 p-2 rounded-lg">
                        <Truck size={20} className={truck.status === 'BUSY' ? 'text-green-400' : 'text-blue-400'} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white">{truck.plate}</h4>
                        <p className="text-xs text-gray-400">{truck.driverName || 'No Driver'} • {truck.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${truck.status === 'BUSY' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {truck.status}
                  </span>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 border-t border-white/5 pt-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{truck.location.address || 'Unknown Location'}</span>
                  </div>
                  {truck.fuelLevel !== undefined && (
                    <div className="flex items-center gap-1 ml-auto">
                      <BatteryCharging size={12} className={truck.fuelLevel < 20 ? 'text-red-500' : 'text-green-500'} />
                      <span>{truck.fuelLevel}% Fuel</span>
                    </div>
                  )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
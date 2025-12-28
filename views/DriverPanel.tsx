import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Truck, DollarSign, Navigation, Calculator, ChevronRight, BarChart3, Settings, LogOut } from 'lucide-react';
import { calculateRouteCost } from '../services/mockEngine';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_REQUESTS = [
  { id: 'r1', from: 'Koramangala', to: 'Hebbal', dist: '14km', offer: 800, type: 'Mini Truck' },
  { id: 'r2', from: 'MG Road', to: 'Airport Cargo', dist: '35km', offer: 2200, type: 'Mini Truck' },
];

const EARNINGS_DATA = [
  { day: 'Mon', amt: 4000 },
  { day: 'Tue', amt: 3200 },
  { day: 'Wed', amt: 5500 },
  { day: 'Thu', amt: 4800 },
  { day: 'Fri', amt: 6100 },
  { day: 'Sat', amt: 7200 },
  { day: 'Sun', amt: 2100 },
];

interface DriverPanelProps {
  onLogout: () => void;
}

export const DriverPanel: React.FC<DriverPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'CALCULATOR' | 'EARNINGS'>('HOME');
  const [calcInputs, setCalcInputs] = useState({ dist: 120, mileage: 12, tolls: 250 });
  const [calcResult, setCalcResult] = useState<any>(null);

  const handleCalculate = () => {
    const res = calculateRouteCost(calcInputs.dist, calcInputs.mileage, calcInputs.tolls);
    setCalcResult(res);
  };

  return (
    <div className="h-full flex flex-col bg-dark-bg">
      <div className="p-4 flex justify-between items-center bg-black/40 backdrop-blur-lg border-b border-white/5">
         <div>
            <h2 className="text-xl font-bold text-white">Hello, Raju</h2>
            <p className="text-xs text-brand-400">Online • Mini Truck</p>
         </div>
         <div className="flex gap-3">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Settings size={20} className="text-gray-400" />
             </div>
             <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400 hover:bg-red-500/20"
             >
                <LogOut size={18} />
             </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-24">
        
        {activeTab === 'HOME' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
               <GlassCard className="bg-gradient-to-br from-brand-900/40 to-black">
                  <p className="text-xs text-gray-400">Today's Earnings</p>
                  <p className="text-2xl font-bold text-brand-400">₹2,450</p>
               </GlassCard>
               <GlassCard className="bg-gradient-to-br from-orange-900/40 to-black">
                  <p className="text-xs text-gray-400">Active Trips</p>
                  <p className="text-2xl font-bold text-orange-400">0</p>
               </GlassCard>
            </div>

            <h3 className="font-bold text-lg mt-6 mb-2">New Requests ({MOCK_REQUESTS.length})</h3>
            {MOCK_REQUESTS.map(req => (
              <GlassCard key={req.id} className="relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                 <div className="flex justify-between items-start">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="bg-white/10 text-xs px-2 py-0.5 rounded text-gray-300">{req.type}</span>
                          <span className="text-xs text-gray-500">{req.dist}</span>
                       </div>
                       <h4 className="font-semibold text-white">{req.from} <span className="text-gray-500 mx-1">→</span> {req.to}</h4>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-bold text-brand-400">₹{req.offer}</p>
                    </div>
                 </div>
                 
                 <div className="mt-4 flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Your Bid" 
                      defaultValue={req.offer} 
                      className="w-24 bg-black/30 border border-white/10 rounded-lg px-2 text-center text-sm" 
                    />
                    <Button fullWidth size="sm" className="py-2 text-sm">Bid Now</Button>
                 </div>
              </GlassCard>
            ))}
          </div>
        )}

        {activeTab === 'CALCULATOR' && (
          <div className="space-y-4">
             <h3 className="text-xl font-bold">Route Cost Estimator</h3>
             <GlassCard>
                <div className="space-y-4">
                   <div>
                      <label className="text-xs text-gray-400">Distance (km)</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Navigation size={18} className="text-brand-500"/>
                        <input 
                          type="range" min="10" max="1000" step="10" 
                          value={calcInputs.dist} 
                          onChange={e => setCalcInputs({...calcInputs, dist: Number(e.target.value)})}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                        />
                        <span className="w-12 text-right font-mono">{calcInputs.dist}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400">Mileage (km/l)</label>
                        <input 
                          type="number" 
                          value={calcInputs.mileage} 
                          onChange={e => setCalcInputs({...calcInputs, mileage: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400">Tolls (₹)</label>
                        <input 
                          type="number" 
                          value={calcInputs.tolls} 
                          onChange={e => setCalcInputs({...calcInputs, tolls: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 mt-1"
                        />
                      </div>
                   </div>

                   <Button fullWidth onClick={handleCalculate} variant="secondary">
                     <Calculator size={18} /> Calculate Profit
                   </Button>
                </div>
             </GlassCard>

             {calcResult && (
               <GlassCard className="bg-brand-900/20 border-brand-500/30 animate-float">
                  <div className="grid grid-cols-2 gap-4 text-center">
                     <div>
                        <p className="text-xs text-gray-400">Fuel Cost</p>
                        <p className="font-bold text-red-400">₹{(calcResult.totalCost - calcResult.tollAvgCost).toFixed(0)}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-400">Total Expense</p>
                        <p className="font-bold text-white">₹{calcResult.totalCost}</p>
                     </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-500/20 text-center">
                     <p className="text-xs text-brand-300 mb-1">Recommended Min. Bid (30% Margin)</p>
                     <p className="text-3xl font-black text-brand-400">₹{calcResult.suggestedBid}</p>
                  </div>
               </GlassCard>
             )}
          </div>
        )}

        {activeTab === 'EARNINGS' && (
          <div className="space-y-4">
             <h3 className="text-xl font-bold">Weekly Performance</h3>
             <GlassCard className="h-64 flex flex-col">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={EARNINGS_DATA}>
                      <XAxis dataKey="day" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#2dd4bf' }}
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                      />
                      <Bar dataKey="amt" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                   </BarChart>
                </ResponsiveContainer>
             </GlassCard>
             
             <div className="grid grid-cols-2 gap-3">
               <GlassCard>
                 <p className="text-xs text-gray-400">Total Trips</p>
                 <p className="text-xl font-bold">14</p>
               </GlassCard>
               <GlassCard>
                 <p className="text-xs text-gray-400">Hours Online</p>
                 <p className="text-xl font-bold">32h</p>
               </GlassCard>
             </div>
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 p-2 flex justify-around items-center pb-6">
          <button onClick={() => setActiveTab('HOME')} className={`p-3 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'HOME' ? 'text-brand-400 bg-white/5' : 'text-gray-500'}`}>
             <Truck size={20} />
             <span className="text-[10px] font-medium">Loads</span>
          </button>
           <button onClick={() => setActiveTab('CALCULATOR')} className={`p-3 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'CALCULATOR' ? 'text-brand-400 bg-white/5' : 'text-gray-500'}`}>
             <Calculator size={20} />
             <span className="text-[10px] font-medium">Calc</span>
          </button>
           <button onClick={() => setActiveTab('EARNINGS')} className={`p-3 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'EARNINGS' ? 'text-brand-400 bg-white/5' : 'text-gray-500'}`}>
             <BarChart3 size={20} />
             <span className="text-[10px] font-medium">Earnings</span>
          </button>
      </div>
    </div>
  );
};
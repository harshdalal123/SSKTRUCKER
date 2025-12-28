import React, { useState, useEffect } from 'react';
import { RealTimeMap } from '../components/RealTimeMap';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import { MapPin, Box, ArrowRight, X, Clock, Star, Phone, MessageSquare, CheckCircle, LogOut, Package, IndianRupee, Truck } from 'lucide-react';
import { BookingStatus, Bid, Load, Truck as TruckType } from '../types';
import { generateMockBids } from '../services/mockEngine';
import { MOCK_TRUCKS } from '../constants';
import { supabase } from '../lib/supabaseClient';

interface CustomerPanelProps {
  onLogout: () => void;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({ onLogout }) => {
  const [step, setStep] = useState<'MAP' | 'CREATE_LOAD' | 'BIDDING' | 'TRACKING'>('MAP');
  
  // Enhanced State for Load Details
  const [loadDetails, setLoadDetails] = useState({ 
    pickup: '', 
    drop: '', 
    weight: '', 
    goodsType: '',
    truckType: 'Mini Truck',
    budget: ''
  });

  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [mapTrucks, setMapTrucks] = useState<TruckType[]>([]);

  // Fetch Trucks for Map
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const { data, error } = await supabase.from('trucks').select('*');
        if (data && !error) {
          setMapTrucks(data as any);
        } else {
          setMapTrucks(MOCK_TRUCKS);
        }
      } catch (e) {
        setMapTrucks(MOCK_TRUCKS);
      }
    };
    fetchMapData();
  }, []);

  // Simulate bids coming in
  useEffect(() => {
    if (step === 'BIDDING') {
      const timer = setTimeout(() => {
        setBids(generateMockBids('load-123'));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handlePostLoad = () => {
    if (!loadDetails.pickup || !loadDetails.drop || !loadDetails.budget) {
        alert("Please fill in all details");
        return;
    }
    setStep('BIDDING');
  };

  const handleAcceptBid = (bid: Bid) => {
    setSelectedBid(bid);
    setStep('TRACKING');
  };

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Real Time Map Background */}
      <div className="absolute inset-0 z-0">
        <RealTimeMap 
          trucks={step === 'MAP' || step === 'CREATE_LOAD' ? mapTrucks : undefined}
          showRoute={step === 'TRACKING'}
          destination={loadDetails.drop}
        />
      </div>

      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div>
           <h1 className="text-2xl font-black text-brand-400 italic tracking-tighter">SSK<span className="text-white">TRUCKER</span></h1>
           <p className="text-xs text-gray-400 font-medium">PREMIUM LOGISTICS</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold">Online</span>
            </div>
            <button 
              onClick={onLogout}
              className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              <LogOut size={14} />
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 z-10 flex flex-col justify-end pb-20 px-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md mx-auto">
          
          {/* STEP 1: INITIAL ACTION */}
          {step === 'MAP' && (
            <GlassCard className="mb-4 animate-float">
               <h2 className="text-lg font-bold mb-2">Where to?</h2>
               <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <LocationAutocomplete 
                      placeholder="Enter Pickup Location" 
                      value={loadDetails.pickup}
                      onChange={(val) => setLoadDetails({...loadDetails, pickup: val})}
                      icon={<MapPin size={16} className="text-brand-400" />}
                    />
                  </div>
               </div>
               <Button className="mt-4" fullWidth onClick={() => setStep('CREATE_LOAD')}>
                  Create Shipment
               </Button>
            </GlassCard>
          )}

          {/* STEP 2: LOAD DETAILS */}
          {step === 'CREATE_LOAD' && (
            <GlassCard className="mb-4 max-h-[75vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#18181b]/95 backdrop-blur-xl z-10 py-2 border-b border-white/5">
                <h3 className="text-lg font-bold text-white">Post Your Load</h3>
                <button onClick={() => setStep('MAP')} className="p-1 hover:bg-white/10 rounded-full"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                {/* Location Details */}
                <div className="space-y-3">
                   <LocationAutocomplete 
                      label="Pickup Location"
                      placeholder="e.g. Industrial Area, Sector 4"
                      icon={<MapPin size={18} className="text-green-400"/>}
                      value={loadDetails.pickup}
                      onChange={(val) => setLoadDetails({...loadDetails, pickup: val})}
                   />
                   <LocationAutocomplete 
                      label="Drop Location"
                      placeholder="e.g. City Center Mall, Dock 2"
                      icon={<MapPin size={18} className="text-red-400"/>}
                      value={loadDetails.drop}
                      onChange={(val) => setLoadDetails({...loadDetails, drop: val})}
                   />
                </div>

                <div className="border-t border-white/10 my-2"></div>

                {/* Goods Details */}
                <div className="grid grid-cols-2 gap-3">
                   <Input 
                      label="Weight (kg)"
                      type="number"
                      placeholder="e.g. 500"
                      icon={<Package size={18} />}
                      value={loadDetails.weight}
                      onChange={(e) => setLoadDetails({...loadDetails, weight: e.target.value})}
                   />
                    <div>
                      <label className="text-xs font-medium text-gray-400 ml-1">Truck Type</label>
                      <div className="relative">
                        <Truck size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                        <select 
                          value={loadDetails.truckType}
                          onChange={(e) => setLoadDetails({...loadDetails, truckType: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white outline-none focus:border-brand-500 transition-all appearance-none [&>option]:bg-gray-900"
                        >
                          <option>Mini Truck</option>
                          <option>Pickup 8ft</option>
                          <option>Container 32ft</option>
                          <option>Trailer 40ft</option>
                        </select>
                      </div>
                   </div>
                </div>

                <Input 
                    label="Goods Description"
                    placeholder="e.g. Furniture, Electronics, Chemicals"
                    icon={<Box size={18} />}
                    value={loadDetails.goodsType}
                    onChange={(e) => setLoadDetails({...loadDetails, goodsType: e.target.value})}
                />
                
                {/* Budget Section */}
                <div className="bg-gradient-to-r from-brand-900/40 to-brand-800/10 p-4 rounded-xl border border-brand-500/30">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-brand-200">Your Budget (₹)</span>
                      <span className="text-xs text-brand-400/70">Estimated: ₹3,500 - ₹4,200</span>
                   </div>
                   <Input 
                      type="number"
                      placeholder="Enter amount you want to pay"
                      className="text-lg font-bold text-brand-400 placeholder-brand-700/50 bg-black/20 border-brand-500/30 focus:border-brand-400"
                      icon={<IndianRupee size={18} className="text-brand-400" />}
                      value={loadDetails.budget}
                      onChange={(e) => setLoadDetails({...loadDetails, budget: e.target.value})}
                   />
                </div>

                <Button fullWidth onClick={handlePostLoad} className="shadow-[0_0_20px_rgba(45,212,191,0.3)]">
                  Post Load & Get Bids
                </Button>
              </div>
            </GlassCard>
          )}

          {/* STEP 3: BIDDING LIST */}
          {step === 'BIDDING' && (
             <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar pb-4">
                <GlassCard className="sticky top-0 z-20 backdrop-blur-xl bg-black/60 mb-2 border-brand-500/30">
                   <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full"></div>
                        <span className="text-sm font-medium">Finding nearby drivers...</span>
                     </div>
                     <span className="text-xs bg-white/10 px-2 py-1 rounded">3 Drivers Found</span>
                   </div>
                   <div className="mt-2 text-xs text-gray-500 flex gap-2 overflow-x-auto">
                      <span className="whitespace-nowrap">Load: {loadDetails.goodsType || 'Goods'}</span> • 
                      <span className="whitespace-nowrap">{loadDetails.truckType}</span> • 
                      <span className="whitespace-nowrap text-brand-400">Budget: ₹{loadDetails.budget}</span>
                   </div>
                </GlassCard>

                {bids.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">Waiting for bids...</div>
                ) : (
                  bids.map((bid, idx) => (
                    <GlassCard key={bid.id} className="animate-float" style={{ animationDelay: `${idx * 0.2}s` }}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                              <img src={`https://picsum.photos/seed/${bid.driverId}/100`} alt="driver" className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <h4 className="font-bold text-white">{bid.driverName}</h4>
                              <div className="flex items-center gap-1 text-xs text-yellow-400">
                                <Star size={10} fill="currentColor" /> {bid.rating} • {bid.vehicleModel}
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-2xl font-bold text-brand-400">₹{bid.amount}</div>
                           <div className="text-xs text-gray-400">ETA: {bid.eta}</div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="secondary" className="flex-1 py-2 text-sm text-red-400 hover:text-red-300">Reject</Button>
                        <Button variant="secondary" className="flex-1 py-2 text-sm">Counter</Button>
                        <Button onClick={() => handleAcceptBid(bid)} className="flex-1 py-2 text-sm">Accept</Button>
                      </div>
                    </GlassCard>
                  ))
                )}
             </div>
          )}

          {/* STEP 4: TRACKING */}
          {step === 'TRACKING' && selectedBid && (
            <GlassCard>
               <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-brand-400">En Route</h3>
                    <p className="text-xs text-gray-400">Arriving in {selectedBid.eta}</p>
                  </div>
                  <div className="bg-brand-500/20 text-brand-300 p-2 rounded-lg">
                    <Clock size={20} className="animate-pulse" />
                  </div>
               </div>

               <div className="flex items-center gap-4 mb-6">
                   <div className="relative">
                      <img src={`https://picsum.photos/seed/${selectedBid.driverId}/100`} className="w-14 h-14 rounded-full border-2 border-brand-500" />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border border-black"></div>
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-lg">{selectedBid.driverName}</h4>
                      <p className="text-sm text-gray-400">{selectedBid.vehicleModel} • {selectedBid.vehicleType}</p>
                   </div>
                   <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"><MessageSquare size={18}/></button>
                      <button className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center hover:bg-brand-500 transition"><Phone size={18}/></button>
                   </div>
               </div>
               
               <div className="space-y-2">
                  <div className="flex gap-3">
                     <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                        <div className="w-0.5 h-full bg-white/10 my-1"></div>
                     </div>
                     <div className="pb-4">
                        <p className="text-xs text-gray-500">Pickup</p>
                        <p className="text-sm font-medium opacity-50">{loadDetails.pickup || 'Location A'}</p>
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500">Current Location</p>
                        <p className="text-sm font-medium text-white">Near Silk Board Junction</p>
                     </div>
                  </div>
               </div>

               <Button fullWidth className="mt-4" variant="secondary" onClick={() => setStep('MAP')}>
                  Cancel Booking
               </Button>
            </GlassCard>
          )}

        </div>
      </div>
    </div>
  );
};
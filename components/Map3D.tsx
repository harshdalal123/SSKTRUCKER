import React from 'react';
import { Navigation } from 'lucide-react';
import { Truck } from '../types';

interface Map3DProps {
  showTrucks?: boolean;
  showRoute?: boolean;
  interactive?: boolean;
  trucks?: Truck[];
}

const Truck3D = ({ status, type, angle = 0 }: { status: 'AVAILABLE' | 'BUSY', type: 'MINI' | 'TRAILER', angle?: number }) => {
  const isAvailable = status === 'AVAILABLE';
  const colorTop = isAvailable ? '#2dd4bf' : '#fb923c'; // brand-400 : orange-400
  const colorSide = isAvailable ? '#0d9488' : '#ea580c'; // brand-600 : orange-600
  
  // Dimensions (scaled down for map)
  const width = 12;
  const height = type === 'TRAILER' ? 14 : 10;
  const length = type === 'TRAILER' ? 36 : 22;
  
  // Transforms for faces
  const transformTop = `translateZ(${height}px)`;
  const transformRight = `rotateX(-90deg) translateZ(${width / 2}px) translateY(${height / 2}px)`; 
  const transformLeft = `rotateX(90deg) translateZ(${width / 2}px) translateY(-${height / 2}px)`;
  const transformFront = `rotateY(90deg) translateZ(${length - width / 2}px) translateY(-${height / 2}px)`;
  const transformBack = `rotateY(180deg) translateZ(${width / 2}px) translateY(-${height / 2}px)`;

  return (
    <div 
      className={`relative group transition-all duration-700 ${isAvailable ? 'animate-float' : ''}`}
      style={{ 
        transformStyle: 'preserve-3d', 
        width: `${length}px`, 
        height: `${width}px` 
      }}
    >
      {/* Inner Rotator */}
      <div className="w-full h-full transform-style-3d" style={{ transform: `rotateZ(${angle}deg)` }}>
          
          {/* Neon Glow for Available */}
          {isAvailable && (
            <div className="absolute inset-0 bg-brand-400/50 blur-[15px] rounded-full animate-pulse-glow" style={{ transform: 'translateZ(-5px) scale(1.5)' }}></div>
          )}
          
          {/* Shadow for Busy */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 blur-[8px] rounded-full" style={{ transform: 'translateZ(-2px) scale(1.2)' }}></div>
          )}

          {/* 3D Box Body */}
          <div className="absolute inset-0 transform-style-3d">
            
            {/* TOP FACE */}
            <div 
              className="absolute inset-0 border border-white/20" 
              style={{ background: colorTop, transform: transformTop, backfaceVisibility: 'hidden' }}
            >
                <div className="absolute top-1 right-1 bottom-1 w-[40%] bg-black/10 rounded-sm"></div>
            </div>

            {/* RIGHT FACE */}
            <div 
              className="absolute top-0 left-0 border border-white/20" 
              style={{ 
                width: length, 
                height: height, 
                background: colorSide, 
                transform: transformRight,
                transformOrigin: 'center center',
                backfaceVisibility: 'hidden' 
              }} 
            >
                <div className="absolute bottom-1 left-2 w-3 h-3 bg-black/80 rounded-full border border-gray-600"></div>
                <div className="absolute bottom-1 right-2 w-3 h-3 bg-black/80 rounded-full border border-gray-600"></div>
            </div>

            {/* LEFT FACE */}
            <div 
              className="absolute top-0 left-0 border border-white/20" 
              style={{ 
                width: length, 
                height: height, 
                background: colorSide, 
                transform: transformLeft,
                transformOrigin: 'center center',
                backfaceVisibility: 'hidden' 
              }} 
            >
                 <div className="absolute bottom-1 left-2 w-3 h-3 bg-black/80 rounded-full border border-gray-600"></div>
                 <div className="absolute bottom-1 right-2 w-3 h-3 bg-black/80 rounded-full border border-gray-600"></div>
            </div>

            {/* FRONT FACE */}
            <div 
              className="absolute top-0 left-0 border border-white/20 flex items-center justify-center bg-gray-200" 
              style={{ 
                width: width, 
                height: height, 
                transform: transformFront,
                transformOrigin: 'center center',
                backfaceVisibility: 'hidden' 
              }} 
            >
               <div className={`w-full h-2 absolute top-1 flex justify-between px-1`}>
                  <div className={`w-2 h-1.5 ${isAvailable ? 'bg-cyan-300 shadow-[0_0_5px_#22d3ee]' : 'bg-yellow-100'} rounded-sm`}></div>
                  <div className={`w-2 h-1.5 ${isAvailable ? 'bg-cyan-300 shadow-[0_0_5px_#22d3ee]' : 'bg-yellow-100'} rounded-sm`}></div>
               </div>
               <div className="w-[80%] h-[40%] bg-black/80 mt-3 rounded-[1px] grid grid-cols-3 gap-[1px] p-[1px]">
                  <div className="bg-gray-700"></div><div className="bg-gray-700"></div><div className="bg-gray-700"></div>
               </div>
            </div>

            {/* BACK FACE */}
            <div 
               className="absolute top-0 left-0 border border-white/20"
               style={{
                 width: width,
                 height: height,
                 background: colorSide,
                 transform: transformBack,
                 transformOrigin: 'center center',
                 backfaceVisibility: 'hidden'
               }}
            >
               <div className="absolute bottom-2 left-1 w-2 h-1 bg-red-600 shadow-[0_0_5px_#dc2626]"></div>
               <div className="absolute bottom-2 right-1 w-2 h-1 bg-red-600 shadow-[0_0_5px_#dc2626]"></div>
            </div>

          </div>
      </div>

       {/* Floating Label */}
       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 pointer-events-none transform -translate-y-2 group-hover:translate-y-0 shadow-2xl" 
            style={{ transform: 'translateZ(40px) rotateX(-45deg)' }}>
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></span>
            {type === 'TRAILER' ? 'Heavy Trailer' : 'Mini Truck'}
          </div>
          <div className="text-[9px] text-gray-400 font-medium mt-0.5 border-t border-white/10 pt-0.5">
             {status === 'AVAILABLE' ? 'Looking for loads' : 'On route to Drop'}
          </div>
      </div>
    </div>
  );
};

export const Map3D: React.FC<Map3DProps> = ({ showTrucks = true, showRoute = false, interactive = true, trucks }) => {
  
  // Helper to project lat/lng to percentage for demo purposes (Bangalore Approx)
  const getPosition = (lat: number, lng: number) => {
    // Bounding Box: 12.85 -> 13.05 (Lat), 77.50 -> 77.80 (Lng)
    const minLat = 12.85, maxLat = 13.05;
    const minLng = 77.50, maxLng = 77.80;
    
    const top = ((maxLat - lat) / (maxLat - minLat)) * 100;
    const left = ((lng - minLng) / (maxLng - minLng)) * 100;
    
    // Clamp to 10-90% to stay on screen
    return {
      top: `${Math.max(10, Math.min(90, top))}%`,
      left: `${Math.max(10, Math.min(90, left))}%`
    };
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0c0c0e]">
      {/* Grid Pattern to simulate ground */}
      <div className={`absolute inset-0 w-[200%] h-[200%] -left-[50%] -top-[50%] transition-transform duration-700 ${interactive ? 'perspective-map' : ''}`}>
        <div className="w-full h-full opacity-20" 
             style={{
               backgroundImage: 'linear-gradient(#2dd4bf 1px, transparent 1px), linear-gradient(90deg, #2dd4bf 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               transform: 'rotateX(60deg)',
             }}>
        </div>
        
        {/* Simulated Route */}
        {showRoute && (
          <svg className="absolute top-[40%] left-[30%] w-[40%] h-[30%] overflow-visible" style={{ transform: 'rotateX(0deg) translateZ(2px)' }}>
            <path 
              d="M10,10 Q150,50 250,100 T400,150" 
              fill="none" 
              stroke="#2dd4bf" 
              strokeWidth="4" 
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_#2dd4bf]"
            />
            {/* Animated dot on route */}
            <circle r="6" fill="white" className="animate-pulse">
               <animateMotion dur="4s" repeatCount="indefinite" path="M10,10 Q150,50 250,100 T400,150" />
            </circle>
          </svg>
        )}

        {/* 3D Elements (Trucks) */}
        {showTrucks && (
          <>
            {trucks ? (
              // Render Dynamic Trucks
              trucks.map((truck) => {
                 const pos = getPosition(truck.location.lat, truck.location.lng);
                 const angle = (truck.id.charCodeAt(0) * 10) % 360; // Pseudo random angle
                 return (
                    <div key={truck.id} className="absolute transition-all duration-1000 ease-in-out" style={{ top: pos.top, left: pos.left, transform: 'translateZ(10px)' }}>
                       <Truck3D 
                         status={truck.status === 'AVAILABLE' ? 'AVAILABLE' : 'BUSY'} 
                         type={truck.type.includes('Trailer') ? 'TRAILER' : 'MINI'} 
                         angle={angle} 
                       />
                    </div>
                 );
              })
            ) : (
              // Fallback / Default Trucks
              <>
                <div className="absolute top-[45%] left-[35%]" style={{ transform: 'translateZ(10px)' }}>
                  <Truck3D status="AVAILABLE" type="MINI" angle={-15} />
                </div>
                <div className="absolute top-[60%] left-[65%]" style={{ transform: 'translateZ(10px)' }}>
                   <Truck3D status="BUSY" type="TRAILER" angle={160} />
                </div>
                <div className="absolute top-[30%] left-[70%]" style={{ transform: 'translateZ(5px)' }}>
                   <Truck3D status="AVAILABLE" type="MINI" angle={45} />
                </div>
              </>
            )}
          </>
        )}
        
        {/* User Location */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translateZ(1px)' }}>
            <div className="relative">
                <div className="absolute w-24 h-24 bg-brand-500/20 rounded-full -top-8 -left-8 animate-ping"></div>
                <div className="absolute w-8 h-8 bg-brand-500 border-2 border-white rounded-full shadow-[0_0_20px_#2dd4bf] z-10 flex items-center justify-center">
                    <Navigation size={14} className="text-white" />
                </div>
            </div>
        </div>
      </div>
      
      {/* Overlay Gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-dark-bg/50 pointer-events-none"></div>
    </div>
  );
};
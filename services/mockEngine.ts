import { TruckType, Bid, RouteCost } from '../types';
import { FUEL_PRICE_DIESEL } from '../constants';

export const generateMockBids = (loadId: string): Bid[] => {
  return [
    {
      id: 'b1',
      driverId: 'd1',
      driverName: 'Rajesh Kumar',
      rating: 4.8,
      amount: 4500,
      eta: '45 mins',
      vehicleType: TruckType.MINI_TRUCK,
      vehicleModel: 'Tata Ace Gold'
    },
    {
      id: 'b2',
      driverId: 'd2',
      driverName: 'Simran Singh',
      rating: 4.9,
      amount: 4200,
      eta: '1 hour',
      vehicleType: TruckType.PICKUP,
      vehicleModel: 'Bolero Pickup'
    },
     {
      id: 'b3',
      driverId: 'd3',
      driverName: 'Ahmed Khan',
      rating: 4.6,
      amount: 4000,
      eta: '1 hr 15m',
      vehicleType: TruckType.MINI_TRUCK,
      vehicleModel: 'Mahindra Supro'
    }
  ];
};

export const calculateRouteCost = (distanceKm: number, mileageKmPerL: number, tollCost: number): RouteCost => {
  const fuelNeeded = distanceKm / mileageKmPerL;
  const fuelCost = fuelNeeded * FUEL_PRICE_DIESEL;
  const totalCost = fuelCost + tollCost;
  
  // Suggest 30% profit margin
  const suggestedBid = totalCost * 1.30;

  return {
    distance: distanceKm,
    fuelPrice: FUEL_PRICE_DIESEL,
    mileage: mileageKmPerL,
    tollCount: Math.floor(distanceKm / 50), // Rough estimate
    tollAvgCost: tollCost,
    totalCost: Math.round(totalCost),
    suggestedBid: Math.round(suggestedBid)
  };
};
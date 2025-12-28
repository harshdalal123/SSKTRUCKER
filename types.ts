export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  FLEET_OWNER = 'FLEET_OWNER',
}

export enum TruckType {
  MINI_TRUCK = 'Mini Truck',
  PICKUP = 'Pickup 8ft',
  CONTAINER = 'Container 32ft',
  TRAILER = 'Trailer 40ft',
}

export enum BookingStatus {
  DRAFT = 'DRAFT',
  BIDDING = 'BIDDING',
  ACCEPTED = 'ACCEPTED',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
}

export interface Location {
  id: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Bid {
  id: string;
  driverId: string;
  driverName: string;
  rating: number;
  amount: number;
  eta: string;
  vehicleType: TruckType;
  vehicleModel: string;
}

export interface Load {
  id: string;
  pickup: Location;
  drop: Location;
  weight: string;
  goodsType: string;
  suggestedPrice: number;
  status: BookingStatus;
  bids: Bid[];
  distance: number; // km
}

export interface Truck {
  id: string;
  plate: string;
  type: TruckType;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  location: Location;
  driverName?: string;
  fuelLevel?: number; // percentage
}

export interface RouteCost {
  distance: number;
  fuelPrice: number;
  mileage: number;
  tollCount: number;
  tollAvgCost: number;
  totalCost: number;
  suggestedBid: number;
}
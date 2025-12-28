import { TruckType, Truck, UserRole } from './types';

export const APP_NAME = "SSK TRUCKER";

export const MOCK_TRUCKS: Truck[] = [
  {
    id: 't1',
    plate: 'KA-01-HH-1234',
    type: TruckType.MINI_TRUCK,
    status: 'AVAILABLE',
    location: { id: 'l1', address: 'Indiranagar', lat: 12.97, lng: 77.63 },
    driverName: 'Raju S',
    fuelLevel: 75
  },
  {
    id: 't2',
    plate: 'MH-04-AB-9876',
    type: TruckType.CONTAINER,
    status: 'BUSY',
    location: { id: 'l2', address: 'Whitefield', lat: 12.96, lng: 77.75 },
    driverName: 'Vikram Singh',
    fuelLevel: 45
  },
  {
    id: 't3',
    plate: 'DL-02-XY-4545',
    type: TruckType.TRAILER,
    status: 'AVAILABLE',
    location: { id: 'l3', address: 'Electronic City', lat: 12.84, lng: 77.66 },
    driverName: 'Suresh Kumar',
    fuelLevel: 90
  }
];

export const FUEL_PRICE_DIESEL = 94.5; // Currency unit per liter
export const FUEL_PRICE_PETROL = 101.2;

export const THEME_COLORS = {
  primary: '#14b8a6',
  secondary: '#6366f1',
  darkBg: '#09090b',
  cardBg: '#18181b',
};

export const ROLE_DESCRIPTIONS = {
  [UserRole.CUSTOMER]: "Ship goods & track loads",
  [UserRole.DRIVER]: "Find loads & earn money",
  [UserRole.FLEET_OWNER]: "Manage trucks & drivers",
};
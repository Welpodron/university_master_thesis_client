import { LatLngExpression } from 'leaflet';

export type TModelField = {
  name: string;
  kind: string;
  type: string;
};

export type TVehicle = {
  id: number;
  name: string;
  capacity: number;
};

export type TTask = {
  id: number;
  latitude: number;
  longitude: number;
  demand: number;
};

export type TJob = {
  id: number;
  date: Date;
  completed: boolean;
};

export type TUser = {
  id: number;
  name: string;
  email: string;
};

export type TAssignment = {
  id: number;
  createdAt: Date;
  vehicleId: number;
  userId: number;
  tasks: TTask[];
};

export type TRouting = {
  id: number;
  startCoords: string;
  endCoords: string;
  distance: number;
  duration: number;
};

export type TSettings = {
  id: number;
  depotLocation: string;
  routingKey: string;
  routingAlgo: string;
  routingAlgoIterations: number;
};

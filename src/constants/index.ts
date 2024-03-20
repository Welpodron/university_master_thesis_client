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
  startId: number;
  endId: number;
  distance: number;
};

import { TModelField } from '@/constants';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type TVehicle = {
  id: number;
  name: string;
  capacity: number;
};

const initialState: {
  establishing: boolean;
  connected: boolean;

  vehicles: { data: TVehicle[]; model: Record<string, TModelField> };
} = {
  connected: false,
  establishing: false,
  vehicles: { data: [], model: {} },
};

const slice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    connect: (state) => {
      state.establishing = true;
    },
    establish: (state) => {
      state.connected = true;
      state.establishing = true;
    },
    submit: (state, action) => {
      return;
    },
    // vehicles API
    setVehicles: (
      state,
      action: PayloadAction<{
        data: TVehicle[];
        model: Record<string, TModelField>;
      }>
    ) => {
      state.vehicles = action.payload;
    },
    addVehicle: (
      state,
      action: PayloadAction<{
        data: TVehicle;
      }>
    ) => {
      state.vehicles.data.push(action.payload.data);
    },
    removeVehicle: (
      state,
      action: PayloadAction<{
        data: number[];
      }>
    ) => {
      state.vehicles.data = state.vehicles.data.filter(
        (row) => !action.payload.data.includes(row.id)
      );
    },
    updateVehicle: (
      state,
      action: PayloadAction<{
        data: TVehicle;
      }>
    ) => {
      state.vehicles.data = state.vehicles.data.map((row) =>
        row.id === action.payload.data.id
          ? {
              ...action.payload.data,
            }
          : row
      );
    },
  },
});

export const {
  connect,
  establish,
  submit,
  setVehicles,
  addVehicle,
  removeVehicle,
  updateVehicle,
} = slice.actions;

export default slice.reducer;

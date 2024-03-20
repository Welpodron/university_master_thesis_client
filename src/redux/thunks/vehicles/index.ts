import { API } from '@/api';
import type { TModelField, TVehicle } from '@/constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const RESTgetVehicles = createAsyncThunk(
  'vehicles/RESTgetVehicles',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<{
        data: TVehicle[];
        model: Record<string, TModelField>;
      }>('/vehicles');

      return { data: data.data, model: data.model };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          message: error.response?.data ?? error.message,
        });
      } else {
        return rejectWithValue({ message: (error as any).message });
      }
    }
  }
);

export const RESTaddVehicle = createAsyncThunk<TVehicle, Omit<TVehicle, 'id'>>(
  'vehicles/RESTaddVehicle',
  async ({ name, capacity }, { rejectWithValue }) => {
    try {
      const { data } = await API.post<TVehicle>('/vehicles', {
        name: name.trim(),
        capacity,
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          message: error.response?.data ?? error.message,
        });
      } else {
        return rejectWithValue({ message: (error as any).message });
      }
    }
  }
);

export const RESTeditVehicle = createAsyncThunk<TVehicle, TVehicle>(
  'vehicles/RESTeditVehicle',
  async ({ id, name, capacity }, { rejectWithValue }) => {
    try {
      const { data } = await API.put<TVehicle>(`/vehicles/${id}`, {
        name: name.trim(),
        capacity,
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          message: error.response?.data ?? error.message,
        });
      } else {
        return rejectWithValue({ message: (error as any).message });
      }
    }
  }
);

export const RESTdeleteVehicles = createAsyncThunk<number[], number[]>(
  'vehicles/RESTdeleteVehicles',
  async (ids, { rejectWithValue }) => {
    try {
      const { data } = await API.delete('/vehicles', {
        data: { ids },
      });

      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          message: error.response?.data ?? error.message,
        });
      } else {
        return rejectWithValue({ message: (error as any).message });
      }
    }
  }
);

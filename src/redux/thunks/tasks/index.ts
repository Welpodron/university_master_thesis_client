import { API } from '@/api';
import type { TModelField, TTask } from '@/constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const RESTgetTasks = createAsyncThunk(
  'tasks/RESTgetTasks',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<{
        data: TTask[];
        model: Record<string, TModelField>;
      }>('/tasks');

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

export const RESTaddTask = createAsyncThunk<TTask, Omit<TTask, 'id'>>(
  'tasks/RESTaddTask',
  async ({ longitude, latitude, demand }, { rejectWithValue }) => {
    try {
      const { data } = await API.post<TTask>('/tasks', {
        latitude,
        longitude,
        demand,
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

export const RESTeditTask = createAsyncThunk<TTask, TTask>(
  'tasks/RESTeditTask',
  async ({ id, longitude, latitude, demand }, { rejectWithValue }) => {
    try {
      const { data } = await API.put<TTask>(`/tasks/${id}`, {
        latitude,
        longitude,
        demand,
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

export const RESTdeleteTasks = createAsyncThunk<number[], number[]>(
  'tasks/RESTdeleteTasks',
  async (ids, { rejectWithValue }) => {
    try {
      const { data } = await API.delete('/tasks', {
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

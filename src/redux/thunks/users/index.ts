import { API } from '@/api';
import type { TModelField, TUser } from '@/constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const RESTgetUsers = createAsyncThunk(
  'users/RESTgetUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<{
        data: TUser[];
        model: Record<string, TModelField>;
      }>('/users');

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

export const RESTaddUser = createAsyncThunk<TUser, Omit<TUser, 'id'>>(
  'users/RESTaddUser',
  async ({ name, email }, { rejectWithValue }) => {
    try {
      const { data } = await API.post<TUser>('/users', {
        name,
        email,
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

export const RESTdeleteUsers = createAsyncThunk<number[], number[]>(
  'users/RESTdeleteUsers',
  async (ids, { rejectWithValue }) => {
    try {
      const { data } = await API.delete('/users', {
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

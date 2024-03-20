import { API } from '@/api';
import type { TModelField, TRouting } from '@/constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const RESTgetRouting = createAsyncThunk(
  'routing/RESTgetRouting',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<{
        data: TRouting[];
        model: Record<string, TModelField>;
      }>('/routing');

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

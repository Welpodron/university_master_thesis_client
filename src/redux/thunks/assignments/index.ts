import { API } from '@/api';
import type { TModelField, TAssignment } from '@/constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const RESTgetAssignments = createAsyncThunk(
  'assignments/RESTgetAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<{
        data: TAssignment[];
        model: Record<string, TModelField>;
      }>('/assignments');

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

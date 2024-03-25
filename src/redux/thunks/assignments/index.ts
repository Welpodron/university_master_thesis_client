import { API } from '@/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const calculateAllAssignments = createAsyncThunk<undefined, null>(
  'assignments/calculateAll',
  async (_, { rejectWithValue }) => {
    try {
      await API.get('/calculate');
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

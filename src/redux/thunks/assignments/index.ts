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

export const getAssignmentDocument = createAsyncThunk<undefined, number>(
  'assignments/getDocument',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/document/${id}`, {
        responseType: 'blob',
      });

      const a = document.createElement('a');
      a.href = URL.createObjectURL(data);
      a.download = `Маршрутный лист №${id}.docx`;
      a.click();
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

export const notifyAssignmentUser = createAsyncThunk<undefined, number>(
  'assignments/notifyAssignmentUser',
  async (id, { rejectWithValue }) => {
    try {
      await API.get(`/notify/${id}`);
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

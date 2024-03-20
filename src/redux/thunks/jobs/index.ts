import { API } from '@/api';
import type { TModelField, TJob } from '@/constants';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const RESTgetJobs = createAsyncThunk(
  'jobs/RESTgetJobs',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get<{
        data: TJob[];
        model: Record<string, TModelField>;
      }>('/jobs');

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

export const RESTaddJob = createAsyncThunk<
  TJob,
  Omit<TJob, 'id' | 'completed'>
>('jobs/RESTaddJob', async ({ date }, { rejectWithValue }) => {
  try {
    const { data } = await API.post<TJob>('/jobs', {
      date,
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
});

export const RESTeditJob = createAsyncThunk<TJob, TJob>(
  'jobs/RESTeditJob',
  async ({ id, date, completed }, { rejectWithValue }) => {
    try {
      const { data } = await API.put<TJob>(`/jobs/${id}`, {
        date,
        completed,
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

export const RESTdeleteJobs = createAsyncThunk<number[], number[]>(
  'jobs/RESTdeleteJobs',
  async (ids, { rejectWithValue }) => {
    try {
      const { data } = await API.delete('/jobs', {
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

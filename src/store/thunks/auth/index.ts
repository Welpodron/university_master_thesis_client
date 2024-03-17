import API from '@/api/API';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

export const authLogin = createAsyncThunk<
  { id: number; role: string },
  { email: string; pass: string }
>('auth/login', async ({ email, pass }, { rejectWithValue }) => {
  try {
    const { data } = await API.post<{
      id: number;
      role: string;
      token: string;
    }>('/login', {
      email,
      pass,
    });

    localStorage.setItem('token', data.token);

    return {
      id: data.id,
      role: data.role,
    };
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

export const authVerify = createAsyncThunk<{ id: number; role: string } | null>(
  'auth/verify',
  async () => {
    const token = localStorage.getItem('token');

    const { data } = await API.post<{
      id: number;
      role: string;
      token: string;
    }>('/verify', undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (token != null) {
      localStorage.setItem('token', token);
    }

    return {
      id: data.id,
      role: data.role,
    };
  }
);

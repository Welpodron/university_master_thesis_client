import { TModelField, TRouting } from '@/constants';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRouting: builder.query<
      { data: TRouting[]; model: Record<string, TModelField> },
      undefined
    >({
      query: () => `routing`,
    }),
    getUsers: builder.query<
      { data: TRouting[]; model: Record<string, TModelField> },
      unknown
    >({
      query: () => `users`,
    }),
  }),
});

export const { useGetRoutingQuery, useGetUsersQuery } = api;

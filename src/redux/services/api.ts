import { TModelField, TRouting, TSettings, TVehicle } from '@/constants';
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
  tagTypes: ['Vehicles', 'Settings'],
  endpoints: (builder) => ({
    getRouting: builder.query<
      { data: TRouting[]; model: Record<string, TModelField> },
      undefined
    >({
      query: () => `routing`,
    }),
    // settings
    getSettings: builder.query<TSettings, undefined>({
      query: () => 'settings',
      providesTags: (result) => [{ type: 'Settings', id: 'LIST' }],
    }),
    // vehicles
    getVehicles: builder.query<
      { data: TVehicle[]; model: Record<string, TModelField> },
      undefined
    >({
      query: () => 'vehicles',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(
                ({ id }) => ({ type: 'Vehicles', id } as const)
              ),
              { type: 'Vehicles', id: 'LIST' },
            ]
          : [{ type: 'Vehicles', id: 'LIST' }],
    }),
    createVehicle: builder.mutation<TVehicle, Omit<TVehicle, 'id'>>({
      query: (body) => ({
        url: 'vehicles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Vehicles', id: 'LIST' }],
    }),
    updateVehicle: builder.mutation<TVehicle, TVehicle>({
      query: ({ id, ...body }) => ({
        url: `vehicles/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Vehicles', id }],
    }),
    deleteVehicles: builder.mutation<number[], number[]>({
      query: (ids) => ({
        url: `vehicles`,
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: (result, error) =>
        result
          ? result.map((id) => ({ type: 'Vehicles', id }))
          : [{ type: 'Vehicles', id: 'LIST' }],
    }),
    getUsers: builder.query<
      { data: TRouting[]; model: Record<string, TModelField> },
      unknown
    >({
      query: () => `users`,
    }),
  }),
});

export const {
  useGetRoutingQuery,
  useGetUsersQuery,
  // vehicles
  useGetVehiclesQuery,
  useCreateVehicleMutation,
  useDeleteVehiclesMutation,
  useUpdateVehicleMutation,
  // settings
  useGetSettingsQuery,
} = api;

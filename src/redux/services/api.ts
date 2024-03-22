import {
  TAssignment,
  TJob,
  TModelField,
  TRouting,
  TSettings,
  TTask,
  TUser,
  TVehicle,
} from '@/constants';
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
  tagTypes: ['Vehicles', 'Tasks', 'Settings', 'Jobs', 'Routing', 'Assignments'],
  endpoints: (builder) => ({
    // assignments
    getAssignments: builder.query<
      { data: TAssignment[]; model: Record<string, TModelField> },
      undefined
    >({
      query: () => `assignments`,
    }),
    // routing
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
    // jobs
    getJobs: builder.query<
      { data: TJob[]; model: Record<string, TModelField> },
      undefined
    >({
      query: () => 'jobs',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Jobs', id } as const)),
              { type: 'Jobs', id: 'LIST' },
            ]
          : [{ type: 'Jobs', id: 'LIST' }],
    }),
    createJob: builder.mutation<TJob, Omit<TJob, 'id' | 'completed'>>({
      query: (body) => ({
        url: 'jobs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Jobs', id: 'LIST' }],
    }),
    updateJob: builder.mutation<TJob, TJob>({
      query: ({ id, ...body }) => ({
        url: `jobs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Jobs', id }],
    }),
    deleteJobs: builder.mutation<number[], number[]>({
      query: (ids) => ({
        url: `jobs`,
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: (result, error) =>
        result
          ? result.map((id) => ({ type: 'Jobs', id }))
          : [{ type: 'Jobs', id: 'LIST' }],
    }),
    // tasks
    getTasks: builder.query<
      { data: TTask[]; model: Record<string, TModelField> },
      undefined
    >({
      query: () => 'tasks',
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Tasks', id } as const)),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
    }),
    createTask: builder.mutation<TTask, Omit<TTask, 'id'>>({
      query: (body) => ({
        url: 'tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
    updateTask: builder.mutation<TTask, TTask>({
      query: ({ id, ...body }) => ({
        url: `tasks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tasks', id }],
    }),
    deleteTasks: builder.mutation<number[], number[]>({
      query: (ids) => ({
        url: `tasks`,
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: (result, error) =>
        result
          ? result.map((id) => ({ type: 'Tasks', id }))
          : [{ type: 'Tasks', id: 'LIST' }],
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
    // users
    getUsers: builder.query<
      { data: TUser[]; model: Record<string, TModelField> },
      unknown
    >({
      query: () => `users`,
    }),
  }),
});

export const {
  // assignments
  useGetAssignmentsQuery,
  // routing
  useGetRoutingQuery,
  // users
  useGetUsersQuery,
  // tasks
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTasksMutation,
  useUpdateTaskMutation,
  // vehicles
  useGetVehiclesQuery,
  useCreateVehicleMutation,
  useDeleteVehiclesMutation,
  useUpdateVehicleMutation,
  // jobs
  useGetJobsQuery,
  useCreateJobMutation,
  useDeleteJobsMutation,
  useUpdateJobMutation,
  // settings
  useGetSettingsQuery,
} = api;

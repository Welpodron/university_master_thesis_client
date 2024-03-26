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
import { notifications } from '@mantine/notifications';

const onQueryStartedErrorToast = async (
  args: any,
  { queryFulfilled }: { queryFulfilled: Promise<any> }
) => {
  try {
    await queryFulfilled;
  } catch (error) {
    const _error = error as {
      error: { status: number | string; error: any; data: any };
    };
    console.dir(error);
    if (_error != null) {
      if (_error?.error?.status == 'FETCH_ERROR') {
        notifications.show({
          color: 'red',
          title: 'Ошибка при обработке запроса',
          message: String(_error?.error?.error),
        });
      } else {
        notifications.show({
          color: 'red',
          title: 'Ошибка при обработке запроса',
          message: String(_error?.error?.data),
        });
      }
    }
  }
};

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
  tagTypes: [
    'Vehicles',
    'Tasks',
    'Settings',
    'Jobs',
    'Routing',
    'Assignments',
    'Users',
    'Personal',
  ],
  endpoints: (builder) => ({
    // works
    getWorks: builder.query<
      { data: TAssignment[]; model: Record<string, TModelField> },
      undefined
    >({
      query: () => `works`,
    }),
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
      providesTags: () => [{ type: 'Settings', id: 'LIST' }],
      onQueryStarted: onQueryStartedErrorToast,
    }),
    updateSettings: builder.mutation<TSettings, Record<string, any>>({
      query: (body) => ({
        url: `settings`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: () => [{ type: 'Settings', id: 'LIST' }],
      onQueryStarted: onQueryStartedErrorToast,
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
      invalidatesTags: (result) =>
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
      invalidatesTags: (result) =>
        result
          ? result.map((id) => ({ type: 'Tasks', id }))
          : [{ type: 'Tasks', id: 'LIST' }],
    }),
    // vehicles
    getVehicle: builder.query<TVehicle, number>({
      query: (id) => `vehicles/${id}`,
    }),
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
      onQueryStarted: onQueryStartedErrorToast,
    }),
    createVehicle: builder.mutation<TVehicle, Omit<TVehicle, 'id'>>({
      query: (body) => ({
        url: 'vehicles',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Vehicles', id: 'LIST' }],
      onQueryStarted: onQueryStartedErrorToast,
    }),
    importVehicles: builder.mutation<TVehicle[], Record<string, any>>({
      query: (body) => ({
        url: 'vehicles_import',
        method: 'POST',
        body: { importedData: body },
      }),
      invalidatesTags: [{ type: 'Vehicles', id: 'LIST' }],
      onQueryStarted: onQueryStartedErrorToast,
    }),
    updateVehicle: builder.mutation<TVehicle, TVehicle>({
      query: ({ id, ...body }) => ({
        url: `vehicles/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Vehicles', id }],
      onQueryStarted: onQueryStartedErrorToast,
    }),
    deleteVehicles: builder.mutation<number[], number[]>({
      query: (ids) => ({
        url: `vehicles`,
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: (result) =>
        result
          ? result.map((id) => ({ type: 'Vehicles', id }))
          : [{ type: 'Vehicles', id: 'LIST' }],
      onQueryStarted: onQueryStartedErrorToast,
    }),
    // users
    getUser: builder.query<TUser, number>({
      query: (id) => `users/${id}`,
    }),
    getUsers: builder.query<
      { data: TUser[]; model: Record<string, TModelField> },
      unknown
    >({
      query: () => `users`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Users', id } as const)),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    createUser: builder.mutation<TUser, Omit<TUser, 'id'>>({
      query: (body) => ({
        url: 'users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: builder.mutation<TUser, Partial<TUser> & { pass?: string }>({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),
    getPersonal: builder.query<TUser, number>({
      query: (id) => `personal/${id}`,
      providesTags: () => [{ type: 'Personal', id: 'LIST' }],
    }),
    updatePersonal: builder.mutation<
      TUser,
      Partial<TUser> & {
        pass?: string;
        passNew?: string;
        passNewConfirm?: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `personal/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Personal', id: 'LIST' },
        { type: 'Users', id },
      ],
    }),
  }),
});

export const {
  // works
  useGetWorksQuery,
  // assignments
  useGetAssignmentsQuery,
  // routing
  useGetRoutingQuery,
  // users
  useGetUserQuery,
  useGetUsersQuery,
  useGetPersonalQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdatePersonalMutation,
  // tasks
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTasksMutation,
  useUpdateTaskMutation,
  // vehicles
  useGetVehicleQuery,
  useGetVehiclesQuery,
  useImportVehiclesMutation,
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
  useUpdateSettingsMutation,
} = api;

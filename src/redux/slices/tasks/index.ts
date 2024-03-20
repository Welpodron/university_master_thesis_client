import type { TTask, TModelField } from '@/constants';
import {
  RESTaddTask,
  RESTdeleteTasks,
  RESTeditTask,
  RESTgetTasks,
} from '@/redux/thunks/tasks';
import { SerializedError, createSlice } from '@reduxjs/toolkit';

const initialState: {
  data: TTask[];
  model: Record<string, TModelField>;
  loading: boolean;
  error: null | SerializedError;
} = {
  data: [],
  model: {},
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(RESTgetTasks.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTgetTasks.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = action.payload.data;
          state.model = action.payload.model;
        }
      })
      .addCase(RESTgetTasks.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTeditTask.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTeditTask.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = state.data.map((row) =>
            row.id === action.payload.id
              ? {
                  ...action.payload,
                }
              : row
          );
        }
      })
      .addCase(RESTeditTask.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTaddTask.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTaddTask.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data.push(action.payload);
        }
      })
      .addCase(RESTaddTask.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTdeleteTasks.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTdeleteTasks.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = state.data.filter(
            (row) => !action.payload.includes(row.id)
          );
        }
      })
      .addCase(RESTdeleteTasks.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      });
  },
});

export default slice.reducer;

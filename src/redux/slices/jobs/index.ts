import type { TJob, TModelField } from '@/constants';
import {
  RESTaddJob,
  RESTdeleteJobs,
  RESTeditJob,
  RESTgetJobs,
} from '@/redux/thunks/jobs';
import { SerializedError, createSlice } from '@reduxjs/toolkit';

const initialState: {
  data: TJob[];
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
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(RESTgetJobs.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTgetJobs.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = action.payload.data;
          state.model = action.payload.model;
        }
      })
      .addCase(RESTgetJobs.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTeditJob.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTeditJob.fulfilled, (state, action) => {
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
      .addCase(RESTeditJob.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTaddJob.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTaddJob.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data.push(action.payload);
        }
      })
      .addCase(RESTaddJob.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTdeleteJobs.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTdeleteJobs.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = state.data.filter(
            (row) => !action.payload.includes(row.id)
          );
        }
      })
      .addCase(RESTdeleteJobs.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      });
  },
});

export default slice.reducer;

import type { TVehicle, TModelField } from '@/constants';
import {
  RESTaddVehicle,
  RESTdeleteVehicles,
  RESTeditVehicle,
  RESTgetVehicles,
} from '@/redux/thunks/vehicles';
import { SerializedError, createSlice } from '@reduxjs/toolkit';

const initialState: {
  data: TVehicle[];
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
  name: 'vehicles',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(RESTgetVehicles.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTgetVehicles.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = action.payload.data;
          state.model = action.payload.model;
        }
      })
      .addCase(RESTgetVehicles.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTeditVehicle.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTeditVehicle.fulfilled, (state, action) => {
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
      .addCase(RESTeditVehicle.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTaddVehicle.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTaddVehicle.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data.push(action.payload);
        }
      })
      .addCase(RESTaddVehicle.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTdeleteVehicles.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTdeleteVehicles.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = state.data.filter(
            (row) => !action.payload.includes(row.id)
          );
        }
      })
      .addCase(RESTdeleteVehicles.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      });
  },
});

export default slice.reducer;

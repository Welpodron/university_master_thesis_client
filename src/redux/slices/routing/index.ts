import type { TModelField, TRouting } from '@/constants';
import { RESTgetRouting } from '@/redux/thunks/routing';
import { SerializedError, createSlice } from '@reduxjs/toolkit';

const initialState: {
  data: TRouting[];
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
  name: 'routing',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(RESTgetRouting.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTgetRouting.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = action.payload.data;
          state.model = action.payload.model;
        }
      })
      .addCase(RESTgetRouting.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      });
  },
});

export default slice.reducer;

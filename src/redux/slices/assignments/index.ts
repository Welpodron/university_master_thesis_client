import type { TModelField, TAssignment } from '@/constants';
import { RESTgetAssignments } from '@/redux/thunks/assignments';
import { SerializedError, createSlice } from '@reduxjs/toolkit';

const initialState: {
  data: TAssignment[];
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
  name: 'assignments',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(RESTgetAssignments.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTgetAssignments.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = action.payload.data;
          state.model = action.payload.model;
        }
      })
      .addCase(RESTgetAssignments.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      });
  },
});

export default slice.reducer;

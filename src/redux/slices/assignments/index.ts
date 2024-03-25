import { calculateAllAssignments } from '@/redux/thunks/assignments';
import { SerializedError, createSlice } from '@reduxjs/toolkit';

const initialState: {
  loading: boolean;
  requestId?: string;
  error: null | SerializedError;
} = {
  loading: false,
  requestId: undefined,
  error: null,
};

const slice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(calculateAllAssignments.pending, (state, action) => {
        if (!state.loading) {
          state.loading = true;
          state.requestId = action.meta.requestId;
          state.error = null;
        }
      })
      .addCase(calculateAllAssignments.fulfilled, (state, action) => {
        if (state.loading && state.requestId === action.meta.requestId) {
          state.loading = false;
          state.requestId = undefined;
        }
      })
      .addCase(calculateAllAssignments.rejected, (state, action) => {
        if (state.loading && state.requestId === action.meta.requestId) {
          state.loading = false;
          state.error = action.payload as SerializedError;
          state.requestId = undefined;
        }
      });
  },
});

export default slice.reducer;

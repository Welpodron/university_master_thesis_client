import {
  calculateAllAssignments,
  getAssignmentDocument,
  notifyAssignmentUser,
} from '@/redux/thunks/assignments';
import { SerializedError, createSlice } from '@reduxjs/toolkit';

const initialState: {
  loadingDocument: boolean;
  errorDocument: null | SerializedError;
  loadingNotify: boolean;
  errorNotify: null | SerializedError;
  loading: boolean;
  requestId?: string;
  error: null | SerializedError;
} = {
  loading: false,
  loadingDocument: false,
  loadingNotify: false,
  requestId: undefined,
  error: null,
  errorDocument: null,
  errorNotify: null,
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
      })
      .addCase(getAssignmentDocument.pending, (state) => {
        if (!state.loadingDocument) {
          state.loadingDocument = true;
          state.errorDocument = null;
        }
      })
      .addCase(getAssignmentDocument.fulfilled, (state) => {
        if (state.loadingDocument) {
          state.loadingDocument = false;
        }
      })
      .addCase(getAssignmentDocument.rejected, (state, action) => {
        if (state.loadingDocument) {
          state.loadingDocument = false;
          state.errorDocument = action.payload as SerializedError;
        }
      })
      .addCase(notifyAssignmentUser.pending, (state) => {
        if (!state.loadingNotify) {
          state.loadingNotify = true;
          state.errorNotify = null;
        }
      })
      .addCase(notifyAssignmentUser.fulfilled, (state) => {
        if (state.loadingNotify) {
          state.loadingNotify = false;
        }
      })
      .addCase(notifyAssignmentUser.rejected, (state, action) => {
        if (state.loadingNotify) {
          state.loadingNotify = false;
          state.errorNotify = action.payload as SerializedError;
        }
      });
  },
});

export default slice.reducer;

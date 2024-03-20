import { SerializedError, createSlice } from '@reduxjs/toolkit';

import { authLogin, authVerify } from '@/redux/thunks/auth';

const initialState: {
  verifying: boolean;
  user: null | { id: number; role: string };
  loading: boolean;
  requestId?: string;
  error: null | SerializedError;
} = {
  user: null,
  verifying: true,
  loading: false,
  requestId: undefined,
  error: null,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(authVerify.pending, (state, action) => {
        state.verifying = true;
        state.requestId = action.meta.requestId;
      })
      .addCase(authVerify.fulfilled, (state, action) => {
        if (state.verifying && state.requestId === action.meta.requestId) {
          state.verifying = false;
          state.user = action.payload;
          state.requestId = undefined;
        }
      })
      .addCase(authVerify.rejected, (state, action) => {
        if (state.verifying && state.requestId === action.meta.requestId) {
          state.verifying = false;
          state.requestId = undefined;
        }
      })
      .addCase(authLogin.pending, (state, action) => {
        if (!state.loading) {
          state.loading = true;
          state.requestId = action.meta.requestId;
          state.error = null;
        }
      })
      .addCase(authLogin.fulfilled, (state, action) => {
        if (state.loading && state.requestId === action.meta.requestId) {
          state.loading = false;
          state.user = action.payload;
          state.requestId = undefined;
        }
      })
      .addCase(authLogin.rejected, (state, action) => {
        if (state.loading && state.requestId === action.meta.requestId) {
          state.loading = false;
          state.error = action.payload as SerializedError;
          state.requestId = undefined;
        }
      });
  },
});

export default slice.reducer;

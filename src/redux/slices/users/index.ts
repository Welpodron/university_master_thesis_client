import type { TUser, TModelField } from '@/constants';
import {
  RESTaddUser,
  RESTdeleteUsers,
  RESTgetUsers,
} from '@/redux/thunks/users';
import { SerializedError, createSlice } from '@reduxjs/toolkit';

const initialState: {
  data: TUser[];
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
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(RESTgetUsers.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTgetUsers.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = action.payload.data;
          state.model = action.payload.model;
        }
      })
      .addCase(RESTgetUsers.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTaddUser.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data.push(action.payload);
        }
      })
      .addCase(RESTaddUser.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      })
      .addCase(RESTdeleteUsers.pending, (state, action) => {
        state.error = null;
        if (!state.loading) {
          state.loading = true;
        }
      })
      .addCase(RESTdeleteUsers.fulfilled, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.data = state.data.filter(
            (row) => !action.payload.includes(row.id)
          );
        }
      })
      .addCase(RESTdeleteUsers.rejected, (state, action) => {
        if (state.loading) {
          state.loading = false;
          state.error = action.error;
        }
      });
  },
});

export default slice.reducer;

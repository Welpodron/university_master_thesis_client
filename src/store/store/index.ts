import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../slices/auth';
import storageReducer from '../slices/storage';
import { socketMiddleware } from '../middlewares/storage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    storage: storageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware()),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

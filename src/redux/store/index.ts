import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../slices/auth';
import taskReducer from '../slices/tasks';
import jobsReducer from '../slices/jobs';
import vehiclesReducer from '../slices/vehicles';
import usersReducer from '../slices/users';
import assignmentsReducer from '../slices/assignments';
// import storageReducer from '../slices/storage';
// import { socketMiddleware } from '../middlewares/storage';
import { api } from '../services/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    jobs: jobsReducer,
    vehicles: vehiclesReducer,
    // users: usersReducer,
    assignments: assignmentsReducer,
    [api.reducerPath]: api.reducer,
    // storage: storageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(socketMiddleware()),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

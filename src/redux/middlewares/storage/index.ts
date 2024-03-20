// import {
//   connect,
//   establish,
//   setVehicles,
//   addVehicle,
//   submit,
//   removeVehicle,
//   updateVehicle,
//   setVehiclesLoading,
// } from '@/store/slices/storage';
// import { AppDispatch, RootState } from '@/store/store';
// import { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
// import { Socket, io } from 'socket.io-client';

// export const socketMiddleware =
//   (): Middleware => (store: MiddlewareAPI<AppDispatch, RootState>) => {
//     let socket: Socket;

//     return (next) => (action) => {
//       const isConnectionEstablished =
//         socket && store.getState().storage.connected;

//       if (connect.match(action)) {
//         socket = io('http://localhost:3000', {
//           withCredentials: true,
//           reconnectionAttempts: 5,
//         });

//         socket.on('connect', () => {
//           console.log('connection established');
//           store.dispatch(establish());
//         });

//         // VEHICLES CRUD
//         socket.on('VEHICLES_MESSAGE', (data) => {
//           store.dispatch(setVehiclesLoading(data));
//         });

//         socket.on('VEHICLES_UPDATE', (data) => {
//           store.dispatch(setVehicles(data));
//         });

//         socket.on('VEHICLE_ADD', (data) => {
//           store.dispatch(addVehicle(data));
//         });

//         socket.on('VEHICLE_UPDATE', (data) => {
//           store.dispatch(updateVehicle(data));
//         });

//         socket.on('VEHICLES_DELETE', (data) => {
//           store.dispatch(removeVehicle(data));
//         });
//       }

//       if (isConnectionEstablished && submit.match(action)) {
//         if (action.payload.type.includes('VEHICLE')) {
//           store.dispatch(setVehiclesLoading(true));
//         }
//         socket.emit(action.payload.type, action.payload.data);
//       }

//       next(action);
//     };
//   };

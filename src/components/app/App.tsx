import 'dayjs/locale/ru';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom';
import { Login } from '@/pages/login';
import { Protected } from '@/pages/protected';
import { Root } from '@/pages/root';
import { Errorable } from '@/pages/errorable';
import { Tasks } from '@/pages/tasks';
import { AuthProvider } from '@/providers/auth';
import { Vehicles } from '@/pages/vehicles';
import { Jobs } from '@/pages/jobs';
import { DatesProvider } from '@mantine/dates';
import { Users } from '@/pages/users';
import { Personal } from '@/pages/personal';
import { Assignments } from '@/pages/assignments';

import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '@/store/store';
import { ReactElement, memo, useEffect, useLayoutEffect, useRef } from 'react';
import { AppDispatch, RootState } from '@/store/store';
import { authVerify } from '@/store/thunks/auth';
import { Verifier } from '../verifier';
import { Storage } from '../storage';

export const App = () => {
  return (
    <Provider store={store}>
      <DatesProvider settings={{ locale: 'ru' }}>
        <Verifier>
          <Storage>
            <BrowserRouter>
              <MantineProvider>
                <ModalsProvider>
                  <Routes>
                    <Route path="/" element={<Root />}>
                      <Route
                        path="vehicles"
                        element={
                          <Protected>
                            <Vehicles />
                          </Protected>
                        }
                      />
                    </Route>
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </ModalsProvider>
              </MantineProvider>
            </BrowserRouter>
          </Storage>
        </Verifier>
      </DatesProvider>
    </Provider>
  );

  // return (
  //   <DatesProvider settings={{ locale: 'ru' }}>
  //     <MantineProvider>
  //       <ModalsProvider>
  //         <BrowserRouter>
  //           <Provider store={store}>
  //             <AuthProvider>
  //               <Routes>
  //                 <Route
  //                   path="/"
  //                   element={<Root />}
  //                   errorElement={<Errorable />}
  //                 >
  //                   <Route
  //                     path="assignments"
  //                     element={
  //                       <Protected role="MANAGER">
  //                         <Assignments />
  //                       </Protected>
  //                     }
  //                   />
  //                   <Route
  //                     path="tasks"
  //                     element={
  //                       <Protected role="MANAGER">
  //                         <Tasks />
  //                       </Protected>
  //                     }
  //                   />
  //                   <Route
  //                     path="vehicles"
  //                     element={
  //                       <Protected role="MANAGER">
  //                         <Vehicles />
  //                       </Protected>
  //                     }
  //                   />
  //                   <Route
  //                     path="jobs"
  //                     element={
  //                       <Protected role="MANAGER">
  //                         <Jobs />
  //                       </Protected>
  //                     }
  //                   />
  //                   <Route
  //                     path="users"
  //                     element={
  //                       <Protected role="MANAGER">
  //                         <Users />
  //                       </Protected>
  //                     }
  //                   />
  //                   <Route
  //                     path="personal"
  //                     element={
  //                       <Protected>
  //                         <Personal />
  //                       </Protected>
  //                     }
  //                   />
  //                 </Route>
  //                 <Route path="/login" element={<Login />} />
  //                 {/* <Route path="/login" element={<Login />} />
  //         <Route
  //           path="/tasks"
  //           element={
  //             <Protected>
  //               <h1>Protected</h1>
  //             </Protected>
  //           }
  //         /> */}
  //               </Routes>
  //             </AuthProvider>
  //           </Provider>
  //         </BrowserRouter>
  //       </ModalsProvider>
  //       <Notifications position="bottom-center" autoClose={false} />
  //     </MantineProvider>
  //   </DatesProvider>
  // );
};

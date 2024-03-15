import 'dayjs/locale/ru';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from '@/pages/login';
import { Protected } from '@/pages/protected';
import { Root } from '@/pages/root';
import { Errorable } from '@/pages/errorable';
import { Tasks } from '@/pages/tasks';
import { AuthProvider } from '@/providers/auth';
import { Vehicles } from '@/pages/vehicles';
import { Jobs } from '@/pages/jobs';
import { DatesProvider } from '@mantine/dates';

export const App = () => {
  return (
    <DatesProvider settings={{ locale: 'ru' }}>
      <MantineProvider>
        <ModalsProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Root />} errorElement={<Errorable />}>
                  <Route
                    path="tasks"
                    element={
                      <Protected role="MANAGER">
                        <Tasks />
                      </Protected>
                    }
                  />
                  <Route
                    path="vehicles"
                    element={
                      <Protected role="MANAGER">
                        <Vehicles />
                      </Protected>
                    }
                  />
                  <Route
                    path="jobs"
                    element={
                      <Protected role="MANAGER">
                        <Jobs />
                      </Protected>
                    }
                  />
                </Route>
                <Route path="/login" element={<Login />} />
                {/* <Route path="/login" element={<Login />} />
          <Route
            path="/tasks"
            element={
              <Protected>
                <h1>Protected</h1>
              </Protected>
            }
          /> */}
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ModalsProvider>
        <Notifications position="bottom-center" autoClose={false} />
      </MantineProvider>
    </DatesProvider>
  );
};

import '@mantine/core/styles.css';
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

export const App = () => {
  return (
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
  );
};

import { ReactNode, createContext, useEffect, useState } from 'react';

import API from '@/api/API';

export type TUser = {
  id: number;
  role: string;
} | null;

export const UserGetterContext = createContext<TUser>(null);
export const UserSetterContext = createContext<(value: TUser) => void>(
  () => {}
);
export const UserInitedGetterContext = createContext(false);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser>(null);
  const [isInited, setIsInited] = useState(false);

  useEffect(() => {
    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const previousRequest = error?.config;

        if (error?.response?.status === 401 && !previousRequest?.sent) {
          previousRequest.sent = true;

          const result = await API.post('/refresh');

          localStorage.setItem('token', result.data.token);

          setUser({ id: result.data.id, role: result.data.role });

          previousRequest.headers.Authorization = `Bearer ${result.data.token}`;

          return API(previousRequest);
        }

        return Promise.reject(error);
      }
    );

    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    (async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const result = await API.post('/verify');

          setUser({ id: result.data.id, role: result.data.role });
        } catch (_) {
        } finally {
          setIsInited(true);
        }
      }
    })();

    return () => {
      API.interceptors.response.eject(responseInterceptor);
      API.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  return (
    <UserInitedGetterContext.Provider value={isInited}>
      <UserGetterContext.Provider value={user}>
        <UserSetterContext.Provider value={setUser}>
          {children}
        </UserSetterContext.Provider>
      </UserGetterContext.Provider>
    </UserInitedGetterContext.Provider>
  );
};

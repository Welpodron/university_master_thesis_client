import { ReactNode, createContext, useEffect, useState } from 'react';

import API from '@/api/API';
import { useNavigate } from 'react-router-dom';

export type TUser = {
  id: number;
  role: string;
  token: string;
} | null;

export const UserGetterContext = createContext<TUser>(null);
export const UserSetterContext = createContext<(value: TUser) => void>(
  () => {}
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const previousRequest = error?.config;

        if (error?.response?.status === 401 && !previousRequest?.sent) {
          previousRequest.sent = true;

          const result = await API.post('/refresh');

          console.log(result.data);

          setUser(result.data);

          previousRequest.headers.Authorization = `Bearer ${result.data.token}`;

          return API(previousRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      return navigate('/login', { replace: true });
    }

    const requestInterceptor = API.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${user?.token}`;

          console.log(config);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      API.interceptors.request.eject(requestInterceptor);
    };
  }, [user]);

  return (
    <UserGetterContext.Provider value={user}>
      <UserSetterContext.Provider value={setUser}>
        {children}
      </UserSetterContext.Provider>
    </UserGetterContext.Provider>
  );
};

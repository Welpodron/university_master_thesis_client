import { UserGetterContext } from '@/providers/auth';
import { UserInitedGetterContext } from '@/providers/auth/Auth';
import { Loader } from '@mantine/core';
import { useContext } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

export const Protected = ({
  children,
  role,
}: {
  children: JSX.Element;
  role?: string;
}) => {
  const user = useContext(UserGetterContext);
  const isInited = useContext(UserInitedGetterContext);

  const location = useLocation();

  if (!isInited) {
    return <Loader />;
  }

  return user ? (
    role != null ? (
      role == user.role ? (
        children
      ) : (
        <Navigate to="/login" state={{ from: location }} />
      )
    ) : (
      children
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

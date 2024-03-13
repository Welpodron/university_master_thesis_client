import { UserGetterContext } from '@/providers/auth';
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

  const location = useLocation();

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

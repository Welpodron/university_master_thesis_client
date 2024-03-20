import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';

export const Protected = ({
  children,
  role,
}: {
  children: JSX.Element;
  role?: string;
}) => {
  const location = useLocation();

  const { user } = useSelector((state: RootState) => state.auth);

  return user ? (
    role != null ? (
      role == user.role ? (
        children
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      )
    ) : (
      children
    )
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

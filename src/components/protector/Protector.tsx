import { ReactElement, memo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Navigate } from 'react-router-dom';

export const Protector = memo(({ children }: { children: ReactElement }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user ? children : <Navigate to="/login" replace />;
});

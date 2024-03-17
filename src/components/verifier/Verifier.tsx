import { AppDispatch, RootState } from '@/store/store';
import { authVerify } from '@/store/thunks/auth';
import { memo, ReactElement, useRef, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const Verifier = memo(({ children }: { children: ReactElement }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { verifying } = useSelector((state: RootState) => state.auth);

  const mounted = useRef(false);

  useLayoutEffect(() => {
    if (!mounted.current) {
      (async () => {
        try {
          await dispatch(authVerify());
        } catch (error) {
          console.error(error);
        }
      })();

      mounted.current = true;
    }
  }, []);

  return verifying ? <>Loading...</> : children;
});

import { connect } from '@/store/slices/storage';
import { AppDispatch } from '@/store/store';
import { ReactElement, memo, useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

export const Storage = memo(({ children }: { children: ReactElement }) => {
  const mounted = useRef(false);
  const dispatch = useDispatch<AppDispatch>();

  useLayoutEffect(() => {
    if (!mounted.current) {
      dispatch(connect());

      mounted.current = true;
    }
  }, []);

  return children;
});

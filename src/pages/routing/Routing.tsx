import { useEffect, useMemo } from 'react';

import { Title } from '@mantine/core';
import { Tabler } from '@/components/tabler';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { RESTgetAssignments } from '@/redux/thunks/assignments';

export const Routing = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, model, loading, error } = useSelector(
    (state: RootState) => state.assignments
  );

  useEffect(() => {
    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Маршрутизация';

    (async () => {
      try {
        dispatch(RESTgetAssignments());
      } catch (error) {
        console.log(error);
      }
    })();
  }, [dispatch]);

  const tableActions = useMemo(() => [], []);

  const groupActions = useMemo(() => [], []);

  const itemActions = useMemo(() => [], []);

  return (
    <>
      <Title>Назначения</Title>
      <Tabler
        {...{
          loading,
          data,
          model,
          tableActions,
          groupActions,
          itemActions,
        }}
      />
    </>
  );
};

import { useEffect, useMemo } from 'react';

import { Title } from '@mantine/core';
import { Tabler } from '@/components/tabler';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useGetRoutingQuery } from '@/redux/services/api';

export const Routing = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, isLoading, error } = useGetRoutingQuery(undefined);

  useEffect(() => {
    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Маршрутизация';

    // (async () => {
    //   try {
    //     dispatch(RESTgetAssignments());
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })();
  }, [dispatch]);

  const tableActions = useMemo(() => [], []);

  const groupActions = useMemo(() => [], []);

  const itemActions = useMemo(() => [], []);

  return (
    <>
      <Title>Маршрутизация</Title>
      <Tabler
        {...{
          loading: isLoading,
          data: (data?.data as any) ?? [],
          model: data?.model ?? {},
          tableActions,
          groupActions,
          itemActions,
        }}
      />
    </>
  );
};

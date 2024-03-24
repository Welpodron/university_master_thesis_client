import { useCallback, useEffect, useMemo } from 'react';

import { useForm } from '@mantine/form';
import {
  Stack,
  NumberInput,
  Button,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDownload, IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { Tabler, TablerEditor } from '@/components/tabler';
import { TAssignment, TUser } from '@/constants';
import { useGetWorksQuery } from '@/redux/services/api';
import { exportData } from '@/utils';

export const Works = () => {
  const { data, isLoading: loading, error } = useGetWorksQuery(undefined);

  useEffect(() => {
    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Назначения';
  }, []);

  const tableActions = useMemo(
    () => [
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: () => {
          exportData(data?.data);
        },
      },
    ],
    [data]
  );

  const groupActions = useMemo(
    () => [
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: (selectedIds: number[]) => {
          if (Array.isArray(selectedIds) && selectedIds.length > 0) {
            if (data?.data) {
              exportData(
                data.data.filter((row) =>
                  selectedIds.some((id) => id == row.id)
                )
              );
            }
          }
        },
      },
    ],
    [data]
  );

  const itemActions = useMemo(
    () => [
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: (item: TAssignment) => {
          exportData([item]);
        },
      },
    ],
    []
  );

  return (
    <>
      <Title>Назначения</Title>
      <Tabler
        {...{
          loading,
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

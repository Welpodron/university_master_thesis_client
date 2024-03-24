import { useEffect, useMemo } from 'react';

import {
  Button,
  NumberInput,
  Stack,
  Title,
  Text,
  Select,
  MultiSelect,
} from '@mantine/core';
import { Tabler, TablerEditor } from '@/components/tabler';
import {
  useGetAssignmentsQuery,
  useGetTasksQuery,
  useGetUsersQuery,
  useGetVehiclesQuery,
} from '@/redux/services/api';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { TAssignment } from '@/constants';
import { exportData } from '@/utils';

export const Assignments = () => {
  const { data, isLoading: loading, error } = useGetAssignmentsQuery(undefined);
  const { data: vehiclesData } = useGetVehiclesQuery(undefined);
  const { data: usersData } = useGetUsersQuery(undefined);
  const { data: tasksData } = useGetTasksQuery(undefined);

  const addForm = useForm<{
    tasksId: string[];
    transportId: string;
    userId: string;
  }>({
    initialValues: {
      tasksId: [],
      transportId: '',
      userId: '',
    },
  });

  useEffect(() => {
    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Назначения';
  }, []);

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const tableActions = useMemo(
    () => [
      {
        name: 'Добавить',
        leftSection: <IconPlus size={20} />,
        color: 'blue',
        onClick: () => {
          openAddDrawer();
        },
      },
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: () => {
          exportData(data?.data);
        },
      },
    ],
    []
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
      {
        name: 'Получить маршрутный лист',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: (item: TAssignment) => {
          // exportData([item]);
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
      <TablerEditor
        type="add"
        opened={isAddDrawerOpened}
        onClose={closeAddDrawer}
      >
        <form>
          <Stack>
            <MultiSelect
              label={
                <>
                  Идентификатор(ы) задач <span style={{ color: 'red' }}>*</span>
                </>
              }
              placeholder="Выберите идентификатор(ы) задач"
              data={
                tasksData?.data
                  ? tasksData.data.map((row) => ({
                      label: `[${row.id}]`,
                      value: String(row.id),
                    }))
                  : []
              }
              required={true}
              searchable={true}
              clearable={true}
              {...addForm.getInputProps('tasksId')}
            />
            <Select
              label="Идентификатор транспорта"
              placeholder="Выберите идентификатор транспорта"
              data={
                vehiclesData?.data
                  ? vehiclesData.data.map((row) => ({
                      label: `[${row.id}] ${row.name}`,
                      value: String(row.id),
                    }))
                  : []
              }
              required={true}
              searchable={true}
              clearable={true}
              {...addForm.getInputProps('transportId')}
            />
            <Select
              label="Идентификатор сотрудника"
              placeholder="Выберите идентификатор сотрудника"
              data={
                usersData?.data
                  ? usersData.data.map((row) => ({
                      label: `[${row.id}] ${row.name}`,
                      value: String(row.id),
                    }))
                  : []
              }
              required={true}
              searchable={true}
              clearable={true}
              {...addForm.getInputProps('userId')}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button
              disabled={true}
              loading={true}
              mt="auto"
              w="100%"
              type="submit"
            >
              Добавить
            </Button>
          </Stack>
        </form>
      </TablerEditor>
    </>
  );
};

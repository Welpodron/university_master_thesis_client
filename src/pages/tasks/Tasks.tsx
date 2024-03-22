import { useCallback, useEffect, useMemo } from 'react';

import { Tabler } from '@/components/tabler/Tabler';
import { useForm } from '@mantine/form';
import { LatLngExpression } from 'leaflet';
import { MapInput } from '@/components/forms/map-input/MapInput';
import {
  Stack,
  NumberInput,
  Button,
  Text,
  Title,
  TextInput,
  Select,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDownload,
  IconListNumbers,
  IconPencil,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { TTask } from '@/constants';
import { TablerEditor } from '@/components/tabler';
import {
  useCreateTaskMutation,
  useDeleteTasksMutation,
  useGetTasksQuery,
  useGetUsersQuery,
  useGetVehiclesQuery,
  useUpdateTaskMutation,
} from '@/redux/services/api';
import { exportData } from '@/utils';

export const Tasks = () => {
  const { data, isLoading: loading, error } = useGetTasksQuery(undefined);
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTasks, { isLoading: isDeliting }] = useDeleteTasksMutation();

  const { data: vehiclesData } = useGetVehiclesQuery(undefined);
  const { data: usersData } = useGetUsersQuery(undefined);

  const addForm = useForm<{
    coordinates: LatLngExpression | null;
    demand: number | null;
  }>({
    initialValues: {
      coordinates: null,
      demand: null,
    },
  });

  const editForm = useForm<{
    id: number;
    coordinates: LatLngExpression | null;
    demand: number | null;
  }>({
    initialValues: {
      id: NaN,
      coordinates: null,
      demand: null,
    },
  });

  const assignmentForm = useForm<{
    taskId: number | null;
    transportId: string;
    userId: string;
  }>({
    initialValues: {
      taskId: null,
      transportId: '',
      userId: '',
    },
  });

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

  const [
    isAssignmentDrawerOpened,
    { open: openAssignmentDrawer, close: closeAssignmentDrawer },
  ] = useDisclosure(false);

  const handleAddFormSubmit = useCallback(
    ({
      coordinates,
      demand,
    }: {
      coordinates: LatLngExpression | null;
      demand: number | null;
    }) => {
      if (!coordinates || !demand) {
        return;
      }

      (async () => {
        try {
          await createTask({
            latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
            longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
            demand,
          });
          closeAddDrawer();
          addForm.reset();
        } catch (error) {
          console.error(error);
        }
      })();
    },
    []
  );

  const handleEditFormSubmit = useCallback(
    ({
      id,
      coordinates,
      demand,
    }: {
      id: number;
      coordinates: LatLngExpression | null;
      demand: number | null;
    }) => {
      if (!coordinates || !demand) {
        return;
      }

      (async () => {
        try {
          await updateTask({
            id,
            latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
            longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
            demand,
          });
          closeEditDrawer();
        } catch (error) {
          console.error(error);
        }
      })();
    },
    []
  );

  const handleDeleteSubmit = useCallback(({ ids }: { ids: number[] }) => {
    if (Array.isArray(ids)) {
      (async () => {
        try {
          await deleteTasks(ids);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, []);

  const openConfirmDeleteModal = ({ ids }: { ids: number[] }) =>
    modals.openConfirmModal({
      title: 'Подтвердите действие',
      centered: true,
      withCloseButton: false,
      children: (
        <Text size="sm">
          Данная операция не является обратимой при нажатии на кнопку
          "Подтвердить" вы осознаете последствия данного действия
        </Text>
      ),
      confirmProps: { color: 'red' },
      labels: { confirm: 'Подтвердить', cancel: 'Отмена' },
      onConfirm: () => {
        handleDeleteSubmit({ ids });
      },
    });

  useEffect(() => {
    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Транспортные заявки';
  }, []);

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
        name: 'Импорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: () => {},
      },
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: () => {
          exportData(data?.data);
        },
      },
      {
        name: 'Расчет',
        color: 'blue',
        leftSection: <IconListNumbers size={20} />,
        onClick: () => {
          console.log(1);
        },
      },
    ],
    [data]
  );

  const groupActions = useMemo(
    () => [
      {
        name: 'Удалить',
        color: 'red',
        leftSection: <IconX size={20} />,
        onClick: (selectedIds: number[]) => {
          if (Array.isArray(selectedIds) && selectedIds.length > 0) {
            openConfirmDeleteModal({ ids: selectedIds });
          }
        },
      },
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
      {
        name: 'Расчет',
        color: 'blue',
        leftSection: <IconListNumbers size={20} />,
        onClick: (selectedIds: number[]) => {
          if (Array.isArray(selectedIds) && selectedIds.length > 0) {
            console.log(selectedIds);
          }
        },
      },
    ],
    [data]
  );

  const itemActions = useMemo(
    () => [
      {
        name: 'Изменить',
        color: 'blue',
        leftSection: <IconPencil size={20} />,
        onClick: (item: TTask) => {
          editForm.setValues({
            id: item.id,
            coordinates: [item.latitude, item.longitude],
            demand: item.demand,
          });
          openEditDrawer();
        },
      },
      {
        name: 'Удалить',
        color: 'red',
        leftSection: <IconX size={20} />,
        onClick: (item: TTask) => {
          openConfirmDeleteModal({ ids: [item.id] });
        },
      },
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: (item: TTask) => {
          exportData([item]);
        },
      },
      {
        name: 'Назначение',
        color: 'blue',
        leftSection: <IconListNumbers size={20} />,
        onClick: (item: TTask) => {
          assignmentForm.setValues({
            taskId: item.id,
          });
          openAssignmentDrawer();
        },
      },
    ],
    []
  );

  return (
    <>
      <Title>Транспортные заявки</Title>
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
        <form onSubmit={addForm.onSubmit(handleAddFormSubmit)}>
          <Stack>
            <MapInput
              state={[
                addForm.getInputProps('coordinates').value,
                addForm.getInputProps('coordinates').onChange,
              ]}
            />
            <NumberInput
              label="Запрос"
              description="Количество элементов / шт"
              placeholder="1"
              allowDecimal={false}
              min={1}
              required={true}
              {...addForm.getInputProps('demand')}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button
              disabled={isCreating}
              loading={isCreating}
              mt="auto"
              w="100%"
              type="submit"
            >
              Добавить
            </Button>
          </Stack>
        </form>
      </TablerEditor>
      <TablerEditor
        type="edit"
        opened={isEditDrawerOpened}
        onClose={closeEditDrawer}
      >
        <form onSubmit={editForm.onSubmit(handleEditFormSubmit)}>
          <Stack>
            <MapInput
              state={[
                editForm.getInputProps('coordinates').value,
                editForm.getInputProps('coordinates').onChange,
              ]}
              isDeleteEnabled={false}
            />
            <NumberInput
              label="Запрос"
              description="Количество элементов / шт"
              placeholder="1"
              allowDecimal={false}
              min={1}
              required={true}
              {...editForm.getInputProps('demand')}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button
              loading={isUpdating}
              disabled={isUpdating}
              type="submit"
              mt="auto"
              w="100%"
            >
              Сохранить
            </Button>
          </Stack>
        </form>
      </TablerEditor>
      <TablerEditor
        type="edit"
        title="Ручное назначение"
        opened={isAssignmentDrawerOpened}
        onClose={closeAssignmentDrawer}
      >
        <form>
          <Stack>
            <TextInput
              readOnly={true}
              disabled={true}
              required={true}
              placeholder="-1"
              label="Идентификатор транспортной заявки"
              value={assignmentForm.values.taskId ?? ''}
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
              {...assignmentForm.getInputProps('transportId')}
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
              {...assignmentForm.getInputProps('userId')}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button
              loading={true}
              disabled={true}
              type="submit"
              mt="auto"
              w="100%"
            >
              Сохранить
            </Button>
          </Stack>
        </form>
      </TablerEditor>
    </>
  );
};

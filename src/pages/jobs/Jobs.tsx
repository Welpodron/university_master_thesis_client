import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from '@mantine/form';
import { Stack, Button, Text, Switch, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDownload, IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { DatePickerInput } from '@mantine/dates';
import { Tabler, TablerEditor } from '@/components/tabler';
import { TJob } from '@/constants';
import {
  useCreateJobMutation,
  useDeleteJobsMutation,
  useGetJobsQuery,
  useUpdateJobMutation,
} from '@/redux/services/api';
import { exportData } from '@/utils';

export const Jobs = () => {
  const { data, isLoading: loading, error } = useGetJobsQuery(undefined);
  const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();
  const [deleteJobs, { isLoading: isDeliting }] = useDeleteJobsMutation();

  const addForm = useForm<{
    date: Date | null;
  }>({
    initialValues: {
      date: null,
    },
  });

  const editForm = useForm<{
    id: number;
    date: Date | null;
    completed: boolean;
  }>({
    initialValues: {
      id: NaN,
      date: null,
      completed: false,
    },
  });

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

  const handleAddFormSubmit = useCallback(({ date }: { date: Date | null }) => {
    if (!date) {
      return;
    }

    (async () => {
      try {
        await createJob({ date });
        closeAddDrawer();
        addForm.reset();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleEditFormSubmit = useCallback(
    ({
      id,
      date,
      completed,
    }: {
      id: number;
      date: Date | null;
      completed: boolean;
    }) => {
      if (!date) {
        return;
      }

      (async () => {
        try {
          await updateJob({
            id,
            date,
            completed: completed === true,
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
          await deleteJobs(ids);
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
      'Задачи';
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
    ],
    [data]
  );

  const itemActions = useMemo(
    () => [
      {
        name: 'Изменить',
        color: 'blue',
        leftSection: <IconPencil size={20} />,
        onClick: (item: TJob) => {
          editForm.setValues({
            id: item.id,
            date: new Date(item.date),
            completed: item.completed,
          });
          openEditDrawer();
        },
      },
      {
        name: 'Удалить',
        color: 'red',
        leftSection: <IconX size={20} />,
        onClick: (item: TJob) => {
          openConfirmDeleteModal({ ids: [item.id] });
        },
      },
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: (item: TJob) => {
          exportData([item]);
        },
      },
    ],
    []
  );

  return (
    <>
      <Title>Агенты</Title>
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
            <DatePickerInput
              label="Дата агента"
              description="Дата когда будет выполнен агент"
              placeholder="Выберите дату ручного выполнения агента"
              minDate={new Date(new Date().setHours(0, 0, 0, 0))}
              required={true}
              {...addForm.getInputProps('date')}
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
            <DatePickerInput
              label="Дата агента"
              description="Дата когда будет выполнен агент"
              placeholder="Выберите дату ручного выполнения агента"
              minDate={new Date(new Date().setHours(0, 0, 0, 0))}
              required={true}
              {...editForm.getInputProps('date')}
            />
            <Switch
              label="Агент выполнен"
              labelPosition="left"
              {...editForm.getInputProps('completed', { type: 'checkbox' })}
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
    </>
  );
};

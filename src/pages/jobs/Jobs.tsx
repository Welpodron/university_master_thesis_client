import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from '@mantine/form';
import { Stack, Button, Text, Switch, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { DatePickerInput } from '@mantine/dates';
import { Tabler, TablerEditor } from '@/components/tabler';
import { useDispatch, useSelector } from 'react-redux';
import { TJob } from '@/constants';
import { AppDispatch, RootState } from '@/redux/store';
import {
  RESTaddJob,
  RESTeditJob,
  RESTdeleteJobs,
  RESTgetJobs,
} from '@/redux/thunks/jobs';

export const Jobs = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, model, error } = useSelector(
    (state: RootState) => state.jobs
  );

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

  const handleAddFormSubmit = useCallback(
    ({ date }: { date: Date | null }) => {
      if (!date) {
        return;
      }

      (async () => {
        try {
          await dispatch(RESTaddJob({ date }));
          closeAddDrawer();
          addForm.reset();
        } catch (error) {
          console.error(error);
        }
      })();
    },
    [dispatch]
  );

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
          await dispatch(
            RESTeditJob({
              id,
              date,
              completed: completed === true,
            })
          );
          closeEditDrawer();
        } catch (error) {
          console.error(error);
        }
      })();
    },
    [dispatch]
  );

  const handleDeleteSubmit = useCallback(
    ({ ids }: { ids: number[] }) => {
      if (Array.isArray(ids)) {
        (async () => {
          try {
            await dispatch(RESTdeleteJobs(ids));
          } catch (error) {
            console.error(error);
          }
        })();
      }
    },
    [dispatch]
  );

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

    (async () => {
      try {
        dispatch(RESTgetJobs());
      } catch (error) {
        console.log(error);
      }
    })();
  }, [dispatch]);

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
    ],
    []
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
    ],
    []
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
    ],
    []
  );

  return (
    <>
      <Title>Агенты</Title>
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
              disabled={loading}
              loading={loading}
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
              loading={loading}
              disabled={loading}
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

import { useCallback, useEffect, useState } from 'react';

type TJob = {
  id: number;
  date: Date;
  completed: boolean;
};

import API from '@/api/API';
import { Tabler } from '@/components/tabler/Tabler';
import { useForm } from '@mantine/form';
import { Stack, Button, Text, Switch, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { DatePickerInput } from '@mantine/dates';
import { TModelField } from '@/constants';

export const Jobs = () => {
  const [model, setModel] = useState<Record<string, TModelField>>({});
  const [data, setData] = useState<TJob[]>([]);

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

  const [isAddFormSubmitting, setIsAddFormSubmitting] = useState(false);
  const [isEditFormSubmitting, setIsEditFormSubmitting] = useState(false);

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

  const handleAddFormSubmit = useCallback(({ date }: { date: Date | null }) => {
    if (!date) {
      return;
    }
    setIsAddFormSubmitting(true);

    (async () => {
      try {
        const res = await API.post<TJob>('/jobs', {
          date,
        });

        setData((data) => [...data, res.data]);
        closeAddDrawer();
      } catch (error) {
        console.error(error);
      } finally {
        setIsAddFormSubmitting(false);
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
      setIsEditFormSubmitting(true);

      (async () => {
        try {
          const res = await API.put<TJob>(`/jobs/${id}`, {
            date,
            completed: completed === true,
          });

          setData((data) =>
            data.map((row) =>
              row.id === res.data.id
                ? {
                    ...res.data,
                  }
                : row
            )
          );

          closeEditDrawer();
        } catch (error) {
          console.error(error);
        } finally {
          setIsEditFormSubmitting(false);
        }
      })();
    },
    []
  );

  const handleDeleteSubmit = useCallback(({ ids }: { ids: number[] }) => {
    if (Array.isArray(ids)) {
      (async () => {
        try {
          await API.delete('/jobs', {
            data: { ids },
          });
          setData((data) => data.filter((row) => !ids.includes(row.id)));
        } catch (error) {
          console.error(error);
        } finally {
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
    const controllerData = new AbortController();
    const controllerModel = new AbortController();

    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Агенты';

    (async () => {
      try {
        const result = await API.get('/_jobsModel', {
          signal: controllerModel.signal,
        });

        console.log(result.data);

        setModel(result.data);
      } catch (error) {
        if (!controllerModel.signal?.aborted) {
          console.error(error);
        }
      }

      try {
        const result = await API.get<TJob[]>('/jobs', {
          signal: controllerData.signal,
        });

        setData(result.data);
      } catch (error) {
        if (!controllerData.signal?.aborted) {
          console.error(error);
        }
      }
    })();

    return () => {
      controllerData.abort();
      controllerModel.abort();
    };
  }, []);

  return (
    <>
      <Title>Агенты</Title>
      <Tabler
        {...{
          data,
          model,
          isAddDrawerOpened,
          openAddDrawer,
          closeAddDrawer,
          isEditDrawerOpened,
          openEditDrawer,
          closeEditDrawer,
          groupActions: [
            {
              name: 'Удалить',
              color: 'red',
              leftSection: <IconX size={20} />,
              onClick: (selectedIds) => {
                if (Array.isArray(selectedIds) && selectedIds.length > 0) {
                  openConfirmDeleteModal({ ids: selectedIds });
                }
              },
            },
          ],
          itemActions: [
            {
              name: 'Изменить',
              color: 'blue',
              leftSection: <IconPencil size={20} />,
              onClick: (item) => {
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
              onClick: (item) => {
                openConfirmDeleteModal({ ids: [item.id] });
              },
            },
          ],
          addForm: (
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
                <Button
                  disabled={isAddFormSubmitting}
                  loading={isAddFormSubmitting}
                  mt="auto"
                  w="100%"
                  type="submit"
                >
                  Добавить
                </Button>
              </Stack>
            </form>
          ),
          onDelete: () => {},
          editForm: (
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
                <Button
                  loading={isEditFormSubmitting}
                  disabled={isEditFormSubmitting}
                  type="submit"
                  mt="auto"
                  w="100%"
                >
                  Сохранить
                </Button>
              </Stack>
            </form>
          ),
        }}
      />
    </>
  );
};

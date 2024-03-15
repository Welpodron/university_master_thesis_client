import { useCallback, useEffect, useState } from 'react';

type TVehicle = {
  id: number;
  name: string;
  capacity: number;
};

import API from '@/api/API';
import { Tabler } from '@/components/tabler/Tabler';
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
import { IconPencil, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { TModelField } from '@/constants';

export const Vehicles = () => {
  const [model, setModel] = useState<Record<string, TModelField>>({});
  const [data, setData] = useState<TVehicle[]>([]);

  const addForm = useForm<{
    name: string;
    capacity: number | null;
  }>({
    initialValues: {
      name: '',
      capacity: null,
    },
  });

  const editForm = useForm<{
    id: number;
    name: string;
    capacity: number | null;
  }>({
    initialValues: {
      id: NaN,
      name: '',
      capacity: null,
    },
  });

  const [isAddFormSubmitting, setIsAddFormSubmitting] = useState(false);
  const [isEditFormSubmitting, setIsEditFormSubmitting] = useState(false);

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

  const handleAddFormSubmit = useCallback(
    ({ name, capacity }: { name: string; capacity: number | null }) => {
      if (!name || !capacity) {
        return;
      }
      setIsAddFormSubmitting(true);

      (async () => {
        try {
          const res = await API.post<TVehicle>('/vehicles', {
            name: name.trim(),
            capacity,
          });

          setData((data) => [...data, res.data]);
          closeAddDrawer();
        } catch (error) {
          console.error(error);
        } finally {
          setIsAddFormSubmitting(false);
        }
      })();
    },
    []
  );

  const handleEditFormSubmit = useCallback(
    ({
      id,
      name,
      capacity,
    }: {
      id: number;
      name: string;
      capacity: number | null;
    }) => {
      if (!name || !capacity) {
        return;
      }
      setIsEditFormSubmitting(true);

      (async () => {
        try {
          const res = await API.put<TVehicle>(`/vehicles/${id}`, {
            name: name.trim(),
            capacity,
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
          await API.delete('/vehicles', {
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
      'Транспорт';

    (async () => {
      try {
        const result = await API.get('/_vehiclesModel', {
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
        const result = await API.get<TVehicle[]>('/vehicles', {
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
      <Title>Транспорт</Title>
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
                  name: item.name,
                  capacity: item.capacity,
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
                <TextInput
                  label="Название"
                  description="Название транспорта"
                  placeholder="Волга"
                  min={1}
                  required={true}
                  {...addForm.getInputProps('name')}
                />
                <NumberInput
                  label="Вместимость"
                  description="Вместимость транспорта"
                  placeholder="1"
                  allowDecimal={false}
                  min={1}
                  required={true}
                  {...addForm.getInputProps('capacity')}
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
                <TextInput
                  label="Название"
                  description="Название транспорта"
                  placeholder="Волга"
                  min={1}
                  required={true}
                  {...editForm.getInputProps('name')}
                />
                <NumberInput
                  label="Вместимость"
                  description="Вместимость транспорта"
                  placeholder="1"
                  allowDecimal={false}
                  min={1}
                  required={true}
                  {...editForm.getInputProps('capacity')}
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

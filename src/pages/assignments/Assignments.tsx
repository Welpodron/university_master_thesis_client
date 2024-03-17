import { useCallback, useEffect, useState } from 'react';

type TTask = {
  id: number;
  latitude: number;
  longitude: number;
  demand: number;
};

import API from '@/api/API';
import { Tabler } from '@/components/tabler/Tabler';
import { useForm } from '@mantine/form';
import { LatLngExpression } from 'leaflet';
import { MapInput } from '@/components/forms/map-input/MapInput';
import { Stack, NumberInput, Button, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { TModelField } from '@/constants';

export const Assignments = () => {
  const [model, setModel] = useState<Record<string, TModelField>>({});
  const [data, setData] = useState<TTask[]>([]);

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

  const [isAddFormSubmitting, setIsAddFormSubmitting] = useState(false);
  const [isEditFormSubmitting, setIsEditFormSubmitting] = useState(false);

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

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
      setIsAddFormSubmitting(true);

      (async () => {
        try {
          const res = await API.post<TTask>('/tasks', {
            latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
            longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
            demand,
          });

          setData((cache) => [...cache, res.data]);

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
      setIsEditFormSubmitting(true);

      (async () => {
        try {
          const res = await API.put<TTask>(`/tasks/${id}`, {
            latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
            longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
            demand,
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
          await API.delete('/tasks', {
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
      'Транспортные заявки';

    (async () => {
      try {
        const result = await API.get('/_assignmentsModel', {
          signal: controllerModel.signal,
        });

        console.log(result.data);

        // setModel(result.data);
      } catch (error) {
        if (!controllerModel.signal?.aborted) {
          console.error(error);
        }
      }

      try {
        const result = await API.get<TTask[]>('/assignments', {
          signal: controllerData.signal,
        });
        console.log(result.data);
        // setData(result.data);
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
      <Title>Транспортные заявки</Title>
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
              onClick: (item) => {
                openConfirmDeleteModal({ ids: [item.id] });
              },
            },
          ],
          addForm: (
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
                  <span style={{ color: 'red' }}>*</span> - поля, обязательные
                  для заполнения
                </Text>
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
                  <span style={{ color: 'red' }}>*</span> - поля, обязательные
                  для заполнения
                </Text>
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

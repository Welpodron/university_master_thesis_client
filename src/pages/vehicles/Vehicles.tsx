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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
  addVehicle,
  removeVehicle,
  submit,
  updateVehicle,
} from '@/store/slices/storage';

export const Vehicles = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { connected, vehicles } = useSelector(
    (state: RootState) => state.storage
  );

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

      if (connected) {
        dispatch(submit({ type: 'ADD_VEHICLE', data: { name, capacity } }));
      } else {
        (async () => {
          try {
            const { data } = await API.post<TVehicle>('/vehicles', {
              name: name.trim(),
              capacity,
            });

            dispatch(addVehicle({ data }));
          } catch (error) {
            console.error(error);
          }
        })();
      }
    },
    [connected, dispatch]
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

      if (connected) {
        dispatch(
          submit({ type: 'UPDATE_VEHICLE', data: { id, name, capacity } })
        );
      } else {
        (async () => {
          try {
            const { data } = await API.put<TVehicle>(`/vehicles/${id}`, {
              name: name.trim(),
              capacity,
            });

            dispatch(updateVehicle({ data }));
          } catch (error) {
            console.error(error);
          }
        })();
      }
    },
    [connected, dispatch]
  );

  const handleDeleteSubmit = useCallback(
    ({ ids }: { ids: number[] }) => {
      if (Array.isArray(ids)) {
        if (connected) {
          dispatch(submit({ type: 'DELETE_VEHICLE', data: ids }));
        } else {
          (async () => {
            try {
              await API.delete('/vehicles', {
                data: { ids },
              });
              dispatch(removeVehicle({ data: ids }));
            } catch (error) {
              console.error(error);
            }
          })();
        }
      }
    },
    [connected, dispatch]
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
    const controllerData = new AbortController();
    const controllerModel = new AbortController();

    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Транспорт';

    if (connected) {
      dispatch(submit({ type: 'GET_VEHICLES' }));
    } else {
      (async () => {
        // try {
        //   const result = await API.get('/_vehiclesModel', {
        //     signal: controllerModel.signal,
        //   });
        //   console.log(result.data);
        //   setModel(result.data);
        // } catch (error) {
        //   if (!controllerModel.signal?.aborted) {
        //     console.error(error);
        //   }
        // }
        // try {
        //   const result = await API.get<TVehicle[]>('/vehicles', {
        //     signal: controllerData.signal,
        //   });
        //   setData(result.data);
        // } catch (error) {
        //   if (!controllerData.signal?.aborted) {
        //     console.error(error);
        //   }
        // }
      })();
    }

    return () => {
      controllerData.abort();
      controllerModel.abort();
    };
  }, [connected, dispatch]);

  return (
    <>
      <Title>Транспорт</Title>
      <Tabler
        {...{
          data: vehicles.data,
          model: vehicles.model,
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

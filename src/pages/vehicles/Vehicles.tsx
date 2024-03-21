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
import { IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { TVehicle } from '@/constants';
import { TablerEditor, Tabler } from '@/components/tabler';
import {
  useCreateVehicleMutation,
  useDeleteVehiclesMutation,
  useGetVehiclesQuery,
  useUpdateVehicleMutation,
} from '@/redux/services/api';

export const Vehicles = () => {
  const { data, isLoading: loading, error } = useGetVehiclesQuery(undefined);
  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicles, { isLoading: isDeliting }] =
    useDeleteVehiclesMutation();

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

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

  const handleAddFormSubmit = useCallback(
    ({ name, capacity }: { name: string; capacity: number | null }) => {
      if (!name || !capacity) {
        return;
      }

      (async () => {
        try {
          await createVehicle({ name, capacity });
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

      (async () => {
        try {
          await updateVehicle({ id, name, capacity });
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
          await deleteVehicles(ids);
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
      'Транспорт';
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
        onClick: (item: TVehicle) => {
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
        onClick: (item: TVehicle) => {
          openConfirmDeleteModal({ ids: [item.id] });
        },
      },
    ],
    []
  );

  return (
    <>
      <Title>Транспорт</Title>
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

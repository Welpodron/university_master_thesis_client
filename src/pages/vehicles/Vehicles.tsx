import { useCallback, useEffect, useMemo } from 'react';

import { useForm } from '@mantine/form';
import {
  Stack,
  NumberInput,
  Button,
  Text,
  TextInput,
  Title,
  Checkbox,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDownload, IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { TVehicle } from '@/constants';
import { TablerEditor, Tabler, TablerImport } from '@/components/tabler';
import {
  useCreateVehicleMutation,
  useDeleteVehiclesMutation,
  useGetVehiclesQuery,
  useImportVehiclesMutation,
  useUpdateVehicleMutation,
} from '@/redux/services/api';
import { exportData } from '@/utils';
import { notifications } from '@mantine/notifications';

export const Vehicles = () => {
  const { data, isLoading: loading, error } = useGetVehiclesQuery(undefined);
  const [createVehicle, { isLoading: isCreating }] = useCreateVehicleMutation();
  const [updateVehicle, { isLoading: isUpdating }] = useUpdateVehicleMutation();
  const [deleteVehicles, { isLoading: isDeleting }] =
    useDeleteVehiclesMutation();
  const [importVehicles, { isLoading: isImporting }] =
    useImportVehiclesMutation();

  const addForm = useForm<{
    name: string;
    capacity: number | null;
    additional: boolean;
  }>({
    initialValues: {
      name: '',
      capacity: null,
      additional: false,
    },
  });

  const editForm = useForm<{
    id: number;
    name: string;
    capacity: number | null;
    additional: boolean;
  }>({
    initialValues: {
      id: NaN,
      name: '',
      capacity: null,
      additional: false,
    },
  });

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

  const [
    isImportDrawerOpened,
    { open: openImportDrawer, close: closeImportDrawer },
  ] = useDisclosure(false);

  const handleAddFormSubmit = useCallback(
    ({
      name,
      capacity,
      additional,
    }: {
      name: string;
      capacity: number | null;
      additional: boolean;
    }) => {
      if (!name || !capacity) {
        return;
      }

      (async () => {
        try {
          await createVehicle({ name, capacity, additional }).unwrap();
          closeAddDrawer();
          addForm.reset();
        } catch (error) {
          console.error(error);
        }
      })();
    },
    []
  );

  const handleImportFormSubmit = useCallback(
    (value: string, reset: () => void) => {
      (async () => {
        try {
          await importVehicles(JSON.parse(value)).unwrap();
          closeImportDrawer();
          reset();
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
      additional,
    }: {
      id: number;
      name: string;
      capacity: number | null;
      additional: boolean;
    }) => {
      if (!name || !capacity) {
        return;
      }

      (async () => {
        try {
          await updateVehicle({ id, name, capacity, additional }).unwrap();
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
          await deleteVehicles(ids).unwrap();
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
      {
        name: 'Импорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: () => {
          openImportDrawer();
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
        onClick: (item: TVehicle) => {
          editForm.setValues({ ...item });
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
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: (item: TVehicle) => {
          exportData([item]);
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
          loading:
            loading || isImporting || isCreating || isDeleting || isUpdating,
          data: (data?.data as any) ?? [],
          model: data?.model ?? {},
          tableActions,
          groupActions,
          itemActions,
        }}
      />
      <TablerImport
        onSubmit={handleImportFormSubmit}
        loading={isImporting}
        opened={isImportDrawerOpened}
        onClose={closeImportDrawer}
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
            <Checkbox
              label="Транспорт является дополнительным"
              {...addForm.getInputProps('additional', { type: 'checkbox' })}
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
            <Checkbox
              label="Транспорт является дополнительным"
              {...editForm.getInputProps('additional', { type: 'checkbox' })}
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

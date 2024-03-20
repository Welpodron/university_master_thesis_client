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
import { useDispatch, useSelector } from 'react-redux';
import { TVehicle } from '@/constants';
import { TablerEditor, Tabler } from '@/components/tabler';
import { RootState, AppDispatch } from '@/redux/store';
import {
  RESTaddVehicle,
  RESTeditVehicle,
  RESTdeleteVehicles,
  RESTgetVehicles,
} from '@/redux/thunks/vehicles';

export const Vehicles = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, data, model, error } = useSelector(
    (state: RootState) => state.vehicles
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
          await dispatch(RESTaddVehicle({ name, capacity }));
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
          await dispatch(RESTeditVehicle({ id, name, capacity }));
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
            await dispatch(RESTdeleteVehicles(ids));
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
      'Транспорт';

    (async () => {
      try {
        dispatch(RESTgetVehicles());
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

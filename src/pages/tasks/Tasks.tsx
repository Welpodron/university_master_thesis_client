import { useCallback, useEffect, useMemo } from 'react';

import { Tabler } from '@/components/tabler/Tabler';
import { useForm } from '@mantine/form';
import { LatLngExpression } from 'leaflet';
import { MapInput } from '@/components/forms/map-input/MapInput';
import { Stack, NumberInput, Button, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { TTask } from '@/constants';
import { TablerEditor } from '@/components/tabler';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  RESTaddTask,
  RESTeditTask,
  RESTdeleteTasks,
  RESTgetTasks,
} from '@/redux/thunks/tasks';

export const Tasks = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, model, loading, error } = useSelector(
    (state: RootState) => state.tasks
  );

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

      (async () => {
        try {
          await dispatch(
            RESTaddTask({
              latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
              longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
              demand,
            })
          );
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
          await dispatch(
            RESTeditTask({
              id,
              latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
              longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
              demand,
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
            await dispatch(RESTdeleteTasks(ids));
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
        dispatch(RESTgetTasks());
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
    ],
    []
  );

  return (
    <>
      <Title>Транспортные заявки</Title>
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

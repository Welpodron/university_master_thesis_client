import { useCallback, useEffect, useMemo } from 'react';

import { Button, NumberInput, Stack, Title, Text, Alert } from '@mantine/core';
import { Tabler, TablerEditor } from '@/components/tabler';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useGetRoutingQuery } from '@/redux/services/api';
import { useForm } from '@mantine/form';
import { LatLngExpression } from 'leaflet';
import { MapInput } from '@/components/forms/map-input/MapInput';
import { useDisclosure } from '@mantine/hooks';
import { TRouting } from '@/constants';
import {
  IconDownload,
  IconInfoCircle,
  IconPencil,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { exportData } from '@/utils';

export const Routing = () => {
  const dispatch = useDispatch<AppDispatch>();

  const addForm = useForm<{
    startCoords: LatLngExpression | null;
    endCoords: LatLngExpression | null;
    distance: number | null;
    duration: number | null;
  }>({
    initialValues: {
      startCoords: null,
      endCoords: null,
      distance: null,
      duration: null,
    },
  });

  const editForm = useForm<{
    id: string;
    startCoords: LatLngExpression | null;
    endCoords: LatLngExpression | null;
    distance: number | null;
    duration: number | null;
  }>({
    initialValues: {
      id: '',
      startCoords: null,
      endCoords: null,
      distance: null,
      duration: null,
    },
  });

  const { data, isLoading: loading, error } = useGetRoutingQuery(undefined);

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const handleAddFormSubmit = useCallback(
    ({
      startCoords,
      endCoords,
      distance,
      duration,
    }: {
      startCoords: LatLngExpression | null;
      endCoords: LatLngExpression | null;
      distance: number | null;
      duration: number | null;
    }) => {
      if (!startCoords || !endCoords || !distance || !duration) {
        return;
      }

      (async () => {
        try {
          // await dispatch(
          //   RESTaddTask({
          //     latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
          //     longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
          //     demand,
          //   })
          // );
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
      startCoords,
      endCoords,
      distance,
      duration,
    }: {
      id: string;
      startCoords: LatLngExpression | null;
      endCoords: LatLngExpression | null;
      distance: number | null;
      duration: number | null;
    }) => {
      if (!startCoords || !endCoords || !distance || !duration) {
        return;
      }

      (async () => {
        try {
          // await dispatch(
          //   RESTeditTask({
          //     id,
          //     latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
          //     longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
          //     demand,
          //   })
          // );
          closeEditDrawer();
        } catch (error) {
          console.error(error);
        }
      })();
    },
    [dispatch]
  );

  const handleDeleteSubmit = useCallback(
    ({ ids }: { ids: string[] }) => {
      if (Array.isArray(ids)) {
        (async () => {
          try {
            console.log(ids);
            // await dispatch(RESTdeleteTasks(ids));
          } catch (error) {
            console.error(error);
          }
        })();
      }
    },
    [dispatch]
  );

  const openConfirmDeleteModal = ({ ids }: { ids: string[] }) =>
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
      'Маршрутизация';

    // (async () => {
    //   try {
    //     dispatch(RESTgetAssignments());
    //   } catch (error) {
    //     console.log(error);
    //   }
    // })();
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
            openConfirmDeleteModal({ ids: selectedIds as any[] });
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
        onClick: (item: TRouting) => {
          editForm.setValues({
            id: item.id as any,
            duration: item.duration,
            distance: item.distance,
            startCoords: JSON.parse(item.startCoords),
            endCoords: JSON.parse(item.endCoords),
          });
          openEditDrawer();
        },
      },
      {
        name: 'Удалить',
        color: 'red',
        leftSection: <IconX size={20} />,
        onClick: (item: TRouting) => {
          openConfirmDeleteModal({ ids: [item.id as any] });
        },
      },
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: (item: TRouting) => {
          exportData([item]);
        },
      },
    ],
    []
  );

  return (
    <>
      <Title>Маршрутизация</Title>
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
            <MapInput
              label="Начало маршрута"
              state={[
                addForm.getInputProps('startCoords').value,
                addForm.getInputProps('startCoords').onChange,
              ]}
              isDeleteEnabled={false}
            />
            <MapInput
              label="Конец маршрута"
              state={[
                addForm.getInputProps('endCoords').value,
                addForm.getInputProps('endCoords').onChange,
              ]}
              isDeleteEnabled={false}
            />
            <NumberInput
              label="Дистанция"
              description="Дистанция маршрута"
              placeholder="1"
              min={1}
              required={true}
              {...addForm.getInputProps('distance')}
            />
            <NumberInput
              label="Длительность"
              description="Длительность маршрута"
              placeholder="1"
              min={1}
              required={true}
              {...addForm.getInputProps('duration')}
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
            <Alert
              variant="light"
              color="orange"
              title="Внимание!"
              icon={<IconInfoCircle />}
            >
              Любая модификация пути, автоматически переводит его в ручной режим
              и удаляет построенную карту маршрута
            </Alert>
            <MapInput
              label="Начало маршрута"
              state={[
                editForm.getInputProps('startCoords').value,
                editForm.getInputProps('startCoords').onChange,
              ]}
              isDeleteEnabled={false}
            />
            <MapInput
              label="Конец маршрута"
              state={[
                editForm.getInputProps('endCoords').value,
                editForm.getInputProps('endCoords').onChange,
              ]}
              isDeleteEnabled={false}
            />
            <NumberInput
              label="Дистанция"
              description="Дистанция маршрута"
              placeholder="1"
              min={1}
              required={true}
              {...editForm.getInputProps('distance')}
            />
            <NumberInput
              label="Длительность"
              description="Длительность маршрута"
              placeholder="1"
              min={1}
              required={true}
              {...editForm.getInputProps('duration')}
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

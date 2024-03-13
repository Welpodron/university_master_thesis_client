import {
  ActionIcon,
  Box,
  Center,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  Table,
  UnstyledButton,
  Text,
  Select,
  Title,
  Button,
  Popover,
  Stack,
  Checkbox,
  Modal,
  SimpleGrid,
  NumberInput,
  Drawer,
  Loader,
  Skeleton,
  LoadingOverlay,
  Menu,
} from '@mantine/core';
import {
  IconArrowNarrowDown,
  IconArrowNarrowUp,
  IconMenu2,
  IconPencil,
  IconPlus,
  IconSelector,
  IconSettings,
  IconX,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

import { modals } from '@mantine/modals';
import { MapInput } from '../forms/map-input/MapInput';
import { TablePagination } from './TablePagination';
import { usePaginate } from './usePaginate';
import { useSort } from './useSort';
import { LatLngExpression } from 'leaflet';

import API from '../../api/API';

import { notifications } from '@mantine/notifications';

type Task = {
  id: number;
  latitude: number;
  longitude: number;
  demand: number;
};

export const _Table = () => {
  const [cache, setCache] = useState<Task[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [selectedRows, setSelectedRows] = useState<{
    [k: string]: boolean;
  }>({});

  const selectedRowsNumber = Object.values(selectedRows).filter(
    (v) => v
  ).length;

  const [shownColumns, setShownColumns] = useState<{
    [k: string]: boolean;
  }>({});

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await API.get<Task[]>('/tasks', {
          signal: controller.signal,
        });

        setCache(res.data);
      } catch (error) {
        if (!controller.signal?.aborted) {
          console.error(error);
          notifications.show({
            title: 'Произошла ошибка',
            message:
              'Произошла ошибка при выполнении сетевого запроса, подробности ошибки выведены в консоль разработчика',
            color: 'red',
          });
        }
      } finally {
        setIsInitialLoading(false);
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (cache.length) {
      setSelectedRows(Object.fromEntries(cache.map((v) => [v.id, false])));
      setShownColumns(
        Object.fromEntries(Object.keys(cache[0]).map((key) => [key, true]))
      );
    }
  }, [cache]);

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

      setIsLoading(true);
      setIsAddFormSubmitting(true);

      (async () => {
        try {
          const res = await API.post<Task>('/task', {
            latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
            longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
            demand,
          });

          setCache((cache) => [...cache, res.data]);
          closeAddDrawer();
        } catch (error) {
          console.error(error);

          notifications.show({
            title: 'Произошла ошибка',
            message:
              'Произошла ошибка при выполнении сетевого запроса, подробности ошибки выведены в консоль разработчика',
            color: 'red',
          });
        } finally {
          setIsLoading(false);
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
      setIsLoading(true);
      setIsEditFormSubmitting(true);

      (async () => {
        try {
          const res = await API.put<Task>(`/task/${id}`, {
            latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
            longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
            demand,
          });

          setCache((cache) =>
            cache.map((row) =>
              row.id === res.data.id
                ? {
                    id: res.data.id,
                    latitude: res.data.latitude,
                    longitude: res.data.longitude,
                    demand: res.data.demand,
                  }
                : row
            )
          );
          closeEditDrawer();
        } catch (error) {
          console.error(error);

          notifications.show({
            title: 'Произошла ошибка',
            message:
              'Произошла ошибка при выполнении сетевого запроса, подробности ошибки выведены в консоль разработчика',
            color: 'red',
          });
        } finally {
          setIsLoading(false);
          setIsEditFormSubmitting(false);
        }
      })();
    },
    []
  );

  const handleDeleteSubmit = useCallback(({ ids }: { ids: number[] }) => {
    if (Array.isArray(ids)) {
      setIsLoading(true);

      (async () => {
        try {
          await API.delete('/task', {
            data: { ids },
          });

          setCache((cache) => cache.filter((row) => !ids.includes(row.id)));
        } catch (error) {
          console.error(error);

          notifications.show({
            title: 'Произошла ошибка',
            message:
              'Произошла ошибка при выполнении сетевого запроса, подробности ошибки выведены в консоль разработчика',
            color: 'red',
          });
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, []);

  const [
    isShownColumnsDrawerOpened,
    { open: openShownColumnsDrawer, close: closeShownColumnsDrawer },
  ] = useDisclosure(false);

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

  const addForm = useForm<{
    coordinates: LatLngExpression | null;
    demand: number | null;
  }>({
    initialValues: {
      coordinates: null,
      demand: null,
    },
  });

  const [isAddFormSubmitting, setIsAddFormSubmitting] = useState(false);

  const [isEditFormSubmitting, setIsEditFormSubmitting] = useState(false);

  const { sortedData, sortBy, sortDirection, setSortDirection, setSortBy } =
    useSort({
      initialData: cache,
    });

  const {
    paginatedData,
    firstPage,
    lastPage,
    totalPages,
    currentPage,
    perPage,
    setCurrentPage,
    handleCurrentPageChange,
    handlePerPageChange,
  } = usePaginate({
    initialData: sortedData,
  });

  const isSelectedRowsChecked = paginatedData.every(
    (row) => selectedRows[row.id]
  );
  const isSelectedRowsIndeterminate =
    paginatedData.some((row) => selectedRows[row.id]) && !isSelectedRowsChecked;

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

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

  return (
    <>
      {isInitialLoading ? (
        <Box pos="relative" mt="xl">
          <Skeleton w="100%" height={500} />
          <Loader
            pos="absolute"
            top="50%"
            left="50%"
            style={{
              transform: 'translate(-50%,-50%)',
            }}
          />
        </Box>
      ) : (
        <Paper withBorder mt="xl" pos="relative">
          <LoadingOverlay
            visible={isLoading}
            zIndex={5}
            overlayProps={{ radius: 'sm', blur: 4 }}
          />
          <Box
            style={{
              borderBottom: '1px solid #ddd',
            }}
          >
            <Group p={10} gap={10}>
              <Menu>
                <Menu.Target>
                  <Button ml="auto">Общие действия</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={openAddDrawer}
                    color="blue"
                    leftSection={<IconPlus size={20} />}
                  >
                    Добавить
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Box>
          {paginatedData.length ? (
            <Box>
              <Box
                style={{
                  overflow: 'auto',
                }}
              >
                <Table>
                  <Table.Thead>
                    <Table.Tr style={{ borderBottom: 0 }}>
                      <Table.Th
                        p={15}
                        style={{
                          lineHeight: 1,
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          borderBottom: '1px solid #ddd',
                          borderRight: '1px solid #ddd',
                          width: '95px',
                        }}
                      >
                        <Group p={0} gap={10}>
                          <Checkbox
                            indeterminate={isSelectedRowsIndeterminate}
                            checked={isSelectedRowsChecked}
                            onChange={(event) => {
                              if (event.currentTarget.checked) {
                                setSelectedRows(
                                  Object.fromEntries(
                                    paginatedData.map((row) => [row.id, true])
                                  )
                                );
                              } else {
                                setSelectedRows((selectedRows) =>
                                  Object.fromEntries(
                                    Object.keys(selectedRows).map((key) => [
                                      key,
                                      false,
                                    ])
                                  )
                                );
                              }
                            }}
                          />
                          <ActionIcon
                            variant="light"
                            onClick={openShownColumnsDrawer}
                            size="lg"
                          >
                            <IconSettings />
                          </ActionIcon>
                          <Drawer
                            offset={8}
                            position="left"
                            radius="md"
                            opened={isShownColumnsDrawerOpened}
                            title={
                              <Text fw={500} fz="lg">
                                Отображение колонок
                              </Text>
                            }
                            onClose={closeShownColumnsDrawer}
                          >
                            <Stack>
                              {Object.keys(paginatedData[0])
                                .filter((key) => key != 'id')
                                .map((key) => (
                                  <Checkbox
                                    value={key}
                                    key={key}
                                    label={key}
                                    checked={shownColumns[key] ?? false}
                                    onChange={(event) =>
                                      setShownColumns((shownColumns) => ({
                                        ...shownColumns,
                                        [event.currentTarget.value]:
                                          event.currentTarget.checked,
                                      }))
                                    }
                                  />
                                ))}
                              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                <Button
                                  onClick={() => {
                                    setShownColumns((shownColumns) =>
                                      Object.fromEntries(
                                        Object.keys(shownColumns).map((key) => [
                                          key,
                                          true,
                                        ])
                                      )
                                    );
                                  }}
                                  variant="light"
                                >
                                  Включить все
                                </Button>
                                <Button
                                  onClick={() => {
                                    setShownColumns((shownColumns) =>
                                      Object.fromEntries(
                                        Object.keys(shownColumns).map((key) =>
                                          key == 'id'
                                            ? [key, true]
                                            : [key, false]
                                        )
                                      )
                                    );
                                  }}
                                  variant="light"
                                >
                                  Отключить все
                                </Button>
                              </SimpleGrid>
                            </Stack>
                          </Drawer>
                        </Group>
                      </Table.Th>
                      {Object.keys(paginatedData[0])
                        .filter((key) => shownColumns[key])
                        .map((key) => (
                          <Table.Th
                            p={0}
                            style={{
                              lineHeight: 1,
                              fontWeight: 500,
                              textTransform: 'uppercase',
                              minWidth: '150px',
                              borderBottom: '1px solid #ddd',
                              borderRight: '1px solid #ddd',
                            }}
                            key={key}
                          >
                            <UnstyledButton
                              p={15}
                              w="100%"
                              onClick={() => {
                                if (key === sortBy) {
                                  setSortDirection((v) =>
                                    v === 'asc' ? 'desc' : 'asc'
                                  );
                                } else {
                                  setSortBy(key);
                                  setSortDirection((v) =>
                                    v === 'asc' ? 'desc' : 'asc'
                                  );
                                }
                              }}
                            >
                              <Group justify="space-between">
                                <Text lh={1} tt="capitalize" fw={500} fz="16">
                                  {key}
                                </Text>
                                <Center>
                                  {key === sortBy ? (
                                    sortDirection === 'asc' ? (
                                      <IconArrowNarrowUp />
                                    ) : (
                                      <IconArrowNarrowDown />
                                    )
                                  ) : (
                                    <IconSelector />
                                  )}
                                </Center>
                              </Group>
                            </UnstyledButton>
                          </Table.Th>
                        ))}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedData.map((item) => (
                      <Table.Tr
                        style={{
                          outline: selectedRows[item.id]
                            ? '2px dashed #09B8FF'
                            : '',
                          outlineOffset: '-4px',
                          background: selectedRows[item.id] ? '#E0FBFF' : '',
                        }}
                        key={item.id}
                      >
                        <Table.Td
                          p={15}
                          style={{
                            lineHeight: 1,
                            width: '95px',
                            borderRight: '1px solid #f5f5f5',
                          }}
                        >
                          <Group p={0} gap={10}>
                            <Checkbox
                              value={item.id}
                              checked={selectedRows[item.id] ?? false}
                              onChange={(event) =>
                                setSelectedRows((selectedRows) => ({
                                  ...selectedRows,
                                  [event.currentTarget.value]:
                                    event.currentTarget.checked,
                                }))
                              }
                            />
                            <Menu>
                              <Menu.Target>
                                <ActionIcon variant="light" size="lg">
                                  <IconMenu2 />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  onClick={() => {
                                    editForm.setValues({
                                      id: item.id,
                                      coordinates: [
                                        item.latitude,
                                        item.longitude,
                                      ],
                                      demand: item.demand,
                                    });
                                    openEditDrawer();
                                  }}
                                  color="blue"
                                  leftSection={<IconPencil size={20} />}
                                >
                                  Изменить
                                </Menu.Item>
                                <Menu.Item
                                  color="red"
                                  onClick={() =>
                                    openConfirmDeleteModal({ ids: [item.id] })
                                  }
                                  leftSection={<IconX size={20} />}
                                >
                                  Удалить
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Table.Td>
                        {Object.entries(item)
                          .filter(([key, _]) => shownColumns[key])
                          .map(([_, value], i) => (
                            <Table.Td
                              p={15}
                              style={{
                                lineHeight: 1,
                                minWidth: '150px',
                                borderRight: '1px solid #f5f5f5',
                              }}
                              key={`${item.id.toString()}_${i}`}
                            >
                              {value.toString()}
                            </Table.Td>
                          ))}
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Box>
            </Box>
          ) : (
            <></>
          )}
          {cache.length > 0 ? (
            <Box style={{ borderTop: '1px solid #ddd' }}>
              <Group p={10} gap={10}>
                <Text lh={1} fz="sm">
                  Выбрано всего: {selectedRowsNumber}
                </Text>
                <Menu>
                  <Menu.Target>
                    <Button disabled={!selectedRowsNumber} ml="auto">
                      Групповые действия
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      color="red"
                      onClick={() =>
                        openConfirmDeleteModal({
                          ids: Object.entries(selectedRows).reduce(
                            (accumulator, [key, value]) =>
                              value
                                ? [...accumulator, parseInt(key)]
                                : accumulator,
                            [] as number[]
                          ),
                        })
                      }
                      leftSection={<IconX size={20} />}
                    >
                      Удалить
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Box>
          ) : (
            <Box>
              <Group p={10} gap={10}>
                <Skeleton animate={false} h={350} />
              </Group>
            </Box>
          )}
          <TablePagination
            {...{
              currentPage,
              setCurrentPage,
              firstPage,
              totalPages,
              lastPage,
              perPage,
              handleCurrentPageChange,
              handlePerPageChange,
              totalRecords: cache.length,
            }}
          />
        </Paper>
      )}
      <Drawer
        offset={8}
        position="right"
        radius="md"
        opened={isEditDrawerOpened}
        title={
          <Text fw={500} fz="lg">
            Редактирование отгрузки
          </Text>
        }
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
              label="Количество"
              description="Количество элементов / шт"
              placeholder="1"
              allowDecimal={false}
              min={1}
              required={true}
              {...editForm.getInputProps('demand')}
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
      </Drawer>
      <Drawer
        offset={8}
        position="right"
        radius="md"
        opened={isAddDrawerOpened}
        title={
          <Text fw={500} fz="lg">
            Добавление отгрузки
          </Text>
        }
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
              label="Количество"
              description="Количество элементов / шт"
              placeholder="1"
              allowDecimal={false}
              min={1}
              required={true}
              {...addForm.getInputProps('demand')}
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
      </Drawer>
    </>
  );
};

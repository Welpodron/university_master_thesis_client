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
  Slider,
  RangeSlider,
  TextInput,
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
  IconChevronDown,
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconChevronUp,
  IconFilter,
  IconMenu2,
  IconPencil,
  IconPlus,
  IconSelector,
  IconSettings,
  IconX,
} from '@tabler/icons-react';
import { TASKS } from './data';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

import { modals } from '@mantine/modals';
import { MapInput } from '../forms/map-input/MapInput';
import { TablePagination } from './TablePagination';
import { usePaginate } from './usePaginate';
import { useSort } from './useSort';
import { LatLngExpression } from 'leaflet';

export const _Table = () => {
  const [cache, setCache] = useState<
    {
      id: number;
      latitude: number;
      longitude: number;
      demand: number;
    }[]
  >([]);

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
    const { signal } = controller;

    const _fetch = async () => {
      try {
        const res = await fetch('http://localhost:3000/tasks', {
          headers: {
            'Content-type': 'application/json',
          },
          signal,
        });

        if (!res.ok) {
          throw new Error(`[${res.status}] ${res.statusText}`);
        }

        const data: {
          id: number;
          latitude: number;
          longitude: number;
          demand: number;
        }[] = await res.json();

        setCache(data);
      } catch (error) {
        if (!signal?.aborted) {
          console.error(error);
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    _fetch();

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

      const _fetch = async () => {
        try {
          const res = await fetch(`http://localhost:3000/task`, {
            method: 'POST',
            body: JSON.stringify({
              latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
              longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
              demand,
            }),
            headers: {
              'Content-type': 'application/json',
            },
          });

          if (!res.ok) {
            throw new Error(`[${res.status}] ${res.statusText}`);
          }

          const data: {
            id: number;
            latitude: number;
            longitude: number;
            demand: number;
          } = await res.json();

          if (data) {
            setCache((cache) => [...cache, data]);
          }

          closeAddDrawer();
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
          setIsAddFormSubmitting(false);
        }
      };

      _fetch();
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

      const _fetch = async () => {
        try {
          const res = await fetch(`http://localhost:3000/task/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
              longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
              demand,
            }),
            headers: {
              'Content-type': 'application/json',
            },
          });

          if (!res.ok) {
            throw new Error(`[${res.status}] ${res.statusText}`);
          }

          const data: {
            id: number;
            latitude: number;
            longitude: number;
            demand: number;
          } = await res.json();

          if (data) {
            setCache((cache) =>
              cache.map((row) =>
                row.id === data.id
                  ? {
                      id: data.id,
                      latitude: data.latitude,
                      longitude: data.longitude,
                      demand: data.demand,
                    }
                  : row
              )
            );
          }

          closeEditDrawer();
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
          setIsEditFormSubmitting(false);
        }
      };

      _fetch();
    },
    []
  );

  const handleDeleteSubmit = useCallback(
    ({ ids }: { ids: number[] | number }) => {
      if (ids === Infinity) {
        setIsLoading(true);

        const _fetch = async () => {
          try {
            const res = await fetch(`http://localhost:3000/tasks`, {
              method: 'DELETE',
              headers: {
                'Content-type': 'application/json',
              },
            });

            if (!res.ok) {
              throw new Error(`[${res.status}] ${res.statusText}`);
            }

            setCache([]);
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        };

        _fetch();
      } else if (Array.isArray(ids)) {
        setIsLoading(true);

        const _fetch = async () => {
          try {
            const res = await fetch(`http://localhost:3000/task`, {
              method: 'DELETE',
              body: JSON.stringify({ ids }),
              headers: {
                'Content-type': 'application/json',
              },
            });

            if (!res.ok) {
              throw new Error(`[${res.status}] ${res.statusText}`);
            }

            setCache((cache) => cache.filter((row) => !ids.includes(row.id)));
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        };

        _fetch();
      }
    },
    []
  );

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

  const filterForm = useForm({});

  // const filterForm = useForm({
  //   initialValues: Object.fromEntries(
  //     Object.keys(cache[0]).map((key) => [key, ''])
  //   ),
  // });

  //Object.keys(cache[0]).map((key) => [key, ''])

  const [isAddFormSubmitting, setIsAddFormSubmitting] = useState(false);

  const [isEditFormSubmitting, setIsEditFormSubmitting] = useState(false);

  const [
    isFiltersFormModalOpened,
    { open: openFiltersFormModal, close: closeFiltersFormModal },
  ] = useDisclosure(false);

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
      title: 'Please confirm your action',
      centered: true,
      withCloseButton: false,
      children: (
        <Text size="sm">
          This action is so important that you are required to confirm it with a
          modal. Please click one of these buttons to proceed.
        </Text>
      ),
      confirmProps: { color: 'red' },
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
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
              {paginatedData.length ? (
                <>
                  <ActionIcon onClick={openFiltersFormModal} size="lg">
                    <IconFilter />
                  </ActionIcon>
                  <Drawer
                    offset={8}
                    position="left"
                    radius="md"
                    opened={isFiltersFormModalOpened}
                    title={
                      <Text fw={500} fz="lg">
                        Фильтр
                      </Text>
                    }
                    onClose={closeFiltersFormModal}
                  >
                    <Stack>
                      {/* <RangeSlider
                    min={1}
                    max={20}
                    labelAlwaysOn
                    mt="xl"
                    minRange={1}
                    defaultValue={[1, 20]}
                  /> */}
                      {Object.keys(paginatedData[0]).map((key) => (
                        <TextInput
                          name={key}
                          key={key}
                          label={key}
                          {...filterForm.getInputProps(key)}
                        />
                      ))}
                      <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <Button>Применить</Button>
                        <Button
                          variant="default"
                          onClick={() => {
                            filterForm.reset();
                            // filterForm.setValues(
                            //   Object.fromEntries(
                            //     Object.keys(cache[0]).map((key) => [key, ''])
                            //   )
                            // );
                          }}
                        >
                          Сбросить
                        </Button>
                      </SimpleGrid>
                    </Stack>
                  </Drawer>
                </>
              ) : (
                <></>
              )}
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
                  <Menu.Item color="red" leftSection={<IconX size={20} />}>
                    Удалить все
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
                                    checked={shownColumns[key]}
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
                              checked={selectedRows[item.id]}
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

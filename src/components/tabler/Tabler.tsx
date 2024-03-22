import { Fragment, memo, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import customParserFormat from 'dayjs/plugin/customParseFormat';

import { useSort } from './hooks/useSort';
import { usePaginate } from './hooks/usePaginate';
import {
  Paper,
  Box,
  Group,
  Button,
  Table,
  Checkbox,
  ActionIcon,
  Drawer,
  Stack,
  SimpleGrid,
  UnstyledButton,
  Center,
  Skeleton,
  Text,
  Menu,
  MenuItemProps,
  useMantineColorScheme,
  Badge,
  TextInput,
  Select,
  NumberInput,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconSettings,
  IconArrowNarrowUp,
  IconArrowNarrowDown,
  IconSelector,
  IconMenu2,
  IconCalendar,
  IconFilter,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { TablerPagination } from './TablerPagination';
import { useFilter } from './hooks/useFilter';
import { TModelField } from '@/constants';
import { DatePickerInput } from '@mantine/dates';
import { modals } from '@mantine/modals';
import {
  MapContainer,
  Marker,
  TileLayer,
  Polyline,
  FeatureGroup,
} from 'react-leaflet';

dayjs.extend(customParserFormat);

//! TODO: Rewrite this fucking shit
const translateColumn = (column: string) => {
  switch (column) {
    case 'longitude':
      return 'долгота';
    case 'latitude':
      return 'широта';
    case 'demand':
      return 'запрос';
    case 'completed':
      return 'завершен';
    case 'createdAt':
      return 'создан (дата)';
    case 'completedAt':
      return 'завершен (дата)';
    case 'name':
      return 'имя';
    case 'capacity':
      return 'вместимость';
    case 'date':
      return 'дата';
    case 'startedAt':
      return 'начат (дата)';
    case 'distance':
      return 'дистанция';
    case 'duration':
      return 'длительность';
    case 'pathCoords':
      return 'маршрут';
    case 'endCoords':
      return 'конец';
    case 'startCoords':
      return 'начало';
    case 'manual':
      return 'ручной';
    case 'additional':
      return 'дополнительный';
    case 'assigned':
      return 'назначена';
    case 'assignedAt':
      return 'назначена (дата)';
    case 'assignmentId':
      return 'id назначения';
    default:
      return column;
  }
};

const FormattedValue = memo(
  ({
    children,
    column,
    field,
  }: {
    children: any;
    column: string;
    field: TModelField;
  }) => {
    if (children == null) {
      return '';
    }

    if (typeof children === 'string') {
      if (dayjs(children.replace(/T.*Z/g, ''), 'YYYY-MM-DD', true).isValid()) {
        return (
          <Badge
            variant="light"
            color="gray"
            rightSection={<IconCalendar size={16} />}
          >
            {dayjs(children).format('DD.MM.YYYY')}
          </Badge>
        );
      }
    }

    if (children === false) {
      return (
        <Badge variant="light" color="red">
          Нет
        </Badge>
      );
    }

    if (children === true) {
      return (
        <Badge variant="light" color="green">
          Да
        </Badge>
      );
    }

    if (column === 'pathCoords') {
      const path = (JSON.parse(children) as any[]).map((path) =>
        path.toReversed()
      ) as any[];
      return (
        <Button
          size="xs"
          onClick={() => {
            modals.open({
              size: 'xl',
              centered: true,
              title: (
                <>
                  [{path[0].join(',')}] -&gt; [{path[path.length - 1].join(',')}
                  ]
                </>
              ),
              children: (
                <Box
                  h={500}
                  style={{
                    borderRadius: '5px',
                    overflow: 'hidden',
                  }}
                >
                  <MapContainer center={path[0]} zoom={12}>
                    <FeatureGroup>
                      <Marker position={path[0]} />
                      <Marker position={path[path.length - 1]} />
                      <Polyline positions={path} color="red" />
                    </FeatureGroup>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  </MapContainer>
                </Box>
              ),
            });
          }}
        >
          Показать на карте
        </Button>
      );
    }

    if (column === 'endCoords' || column === 'startCoords') {
      return (
        <Button
          size="xs"
          onClick={() => {
            modals.open({
              size: 'xl',
              centered: true,
              title: children,
              children: (
                <Box
                  h={300}
                  style={{
                    borderRadius: '5px',
                    overflow: 'hidden',
                  }}
                >
                  <MapContainer center={JSON.parse(children)} zoom={16}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={JSON.parse(children)} />
                  </MapContainer>
                </Box>
              ),
            });
          }}
        >
          Показать на карте
        </Button>
      );
    }

    return children.toString();
  }
);

export type TTablerProps<T extends Record<string, any> & { id: number }> = {
  data: T[];
  model: Record<string, TModelField>;
  loading: boolean;

  tableActions: (MenuItemProps & {
    name: string;
    onClick: () => void;
  })[];

  itemActions: (MenuItemProps & {
    name: string;
    onClick: (data: T) => void;
  })[];

  groupActions: (MenuItemProps & {
    name: string;
    onClick: (data: number[]) => void;
  })[];
};

const _Tabler = <T extends Record<string, any> & { id: number }>({
  data,
  model,
  loading,
  tableActions,
  itemActions,
  groupActions,
}: TTablerProps<T>) => {
  const { colorScheme } = useMantineColorScheme();

  const [cache, setCache] = useState(data);

  const [selectedRows, setSelectedRows] = useState<{
    [k: string]: boolean;
  }>({});

  const selectedRowsNumber = Object.values(selectedRows).filter(
    (v) => v
  ).length;

  const [shownColumns, setShownColumns] = useState<{
    [k: string]: boolean;
  }>({});

  const [filterObject, setFilterObject] = useState<{
    [k: string]: any;
  }>({});

  //! TODO: wtf is this???
  const [filterForm, setFilterForm] = useState<{
    [k: string]: any;
  }>({});

  const [
    isShownColumnsDrawerOpened,
    { open: openShownColumnsDrawer, close: closeShownColumnsDrawer },
  ] = useDisclosure(false);

  const [
    isFilterDrawerOpened,
    { open: openFilterDrawer, close: closeFilterDrawer },
  ] = useDisclosure(false);

  useEffect(() => {
    setCache(data);
  }, [data]);

  useEffect(() => {
    if (cache.length) {
      setSelectedRows(Object.fromEntries(cache.map((v) => [v.id, false])));
      setShownColumns(
        Object.fromEntries(Object.keys(cache[0]).map((key) => [key, true]))
      );
      setFilterObject(
        Object.fromEntries(Object.keys(cache[0]).map((key) => [key, null]))
      );
      setFilterForm(
        Object.fromEntries(Object.keys(cache[0]).map((key) => [key, null]))
      );
    }
  }, [cache]);

  const { filteredData } = useFilter({
    initialData: cache,
    filterObject,
  });

  const { sortedData, sortBy, sortDirection, setSortDirection, setSortBy } =
    useSort({
      initialData: filteredData,
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

  return (
    <>
      <Paper withBorder mt="xl" pos="relative">
        <LoadingOverlay
          visible={loading}
          zIndex={5}
          overlayProps={{ radius: 'sm', blur: 4 }}
        />
        <Box
          style={{
            borderBottom: `1px solid ${
              colorScheme === 'light' ? '#ddd' : '#424242'
            }`,
          }}
        >
          <Group p={10} gap={10}>
            {cache.length > 0 && (
              <>
                <ActionIcon
                  onClick={openFilterDrawer}
                  variant="light"
                  size="lg"
                >
                  <IconFilter />
                </ActionIcon>
                <Drawer
                  offset={8}
                  position="left"
                  radius="md"
                  opened={isFilterDrawerOpened}
                  title={
                    <Text fw={500} fz="lg">
                      Фильтр
                    </Text>
                  }
                  onClose={closeFilterDrawer}
                >
                  <Stack>
                    {Object.entries(filterForm).map(([key, value]) => {
                      if (model[key]) {
                        if (model[key].type === 'Boolean') {
                          return (
                            <Select
                              key={key}
                              label={translateColumn(key)}
                              clearable={true}
                              value={
                                value == null
                                  ? null
                                  : value === true
                                  ? 'Y'
                                  : 'N'
                              }
                              onChange={(_value) => {
                                setFilterForm((filter) => {
                                  return {
                                    ...filter,
                                    [key]:
                                      _value == null
                                        ? null
                                        : _value === 'Y'
                                        ? true
                                        : false,
                                  };
                                });
                              }}
                              data={[
                                {
                                  label: 'Да',
                                  value: 'Y',
                                },
                                {
                                  label: 'Нет',
                                  value: 'N',
                                },
                              ]}
                            />
                          );
                        }

                        if (model[key].type === 'Int') {
                          return (
                            <NumberInput
                              label={translateColumn(key)}
                              key={key}
                              value={value ?? ''}
                              allowDecimal={false}
                              onChange={(_value) =>
                                setFilterForm((filter) => {
                                  return {
                                    ...filter,
                                    [key]:
                                      typeof _value === 'string'
                                        ? null
                                        : _value,
                                  };
                                })
                              }
                            />
                          );
                        }

                        if (model[key].type === 'Float') {
                          return (
                            <NumberInput
                              label={translateColumn(key)}
                              key={key}
                              value={value ?? ''}
                              allowDecimal={true}
                              onChange={(_value) =>
                                setFilterForm((filter) => {
                                  return {
                                    ...filter,
                                    [key]:
                                      typeof _value === 'string'
                                        ? null
                                        : _value,
                                  };
                                })
                              }
                            />
                          );
                        }

                        if (model[key].type === 'DateTime') {
                          return (
                            <DatePickerInput
                              leftSection={<IconCalendar size={16} />}
                              clearable={true}
                              leftSectionPointerEvents="none"
                              label={translateColumn(key)}
                              key={key}
                              value={value}
                              onChange={(_value) => {
                                setFilterForm((filter) => {
                                  return {
                                    ...filter,
                                    [key]: _value,
                                  };
                                });
                              }}
                            />
                          );
                        }
                      }

                      return <Fragment key={key}></Fragment>;
                    })}
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                      <Button
                        onClick={() => {
                          setSelectedRows((selectedRows) =>
                            Object.fromEntries(
                              Object.keys(selectedRows).map((key) => [
                                key,
                                false,
                              ])
                            )
                          );
                          setFilterObject(filterForm);
                        }}
                      >
                        Применить
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedRows((selectedRows) =>
                            Object.fromEntries(
                              Object.keys(selectedRows).map((key) => [
                                key,
                                false,
                              ])
                            )
                          );
                          setFilterForm((filter) =>
                            Object.fromEntries(
                              Object.keys(filter).map((key) => [key, null])
                            )
                          );
                          setFilterObject((filter) =>
                            Object.fromEntries(
                              Object.keys(filter).map((key) => [key, null])
                            )
                          );
                        }}
                        variant="light"
                      >
                        Сбросить
                      </Button>
                    </SimpleGrid>
                  </Stack>
                </Drawer>
              </>
            )}
            {tableActions.length > 0 && (
              <Menu>
                <Menu.Target>
                  <Button ml="auto">Общие действия</Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {tableActions.map((action, index) => (
                    <Menu.Item
                      key={index}
                      onClick={action.onClick}
                      color={action.color}
                      leftSection={action.leftSection}
                    >
                      {action.name}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
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
                        borderBottom: `1px solid ${
                          colorScheme === 'light' ? '#ddd' : '#424242'
                        }`,
                        borderRight: `1px solid ${
                          colorScheme === 'light' ? '#ddd' : '#424242'
                        }`,
                        width: '95px',
                      }}
                    >
                      <Group p={0} gap={10}>
                        {groupActions.length > 0 && (
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
                        )}
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
                                  label={translateColumn(key)}
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
                                        key == 'id' ? [key, true] : [key, false]
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
                            minWidth: `${key == 'id' ? '95px' : '150px'}`,
                            borderBottom: `1px solid ${
                              colorScheme === 'light' ? '#ddd' : '#424242'
                            }`,
                            borderRight: `1px solid ${
                              colorScheme === 'light' ? '#ddd' : '#424242'
                            }`,
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
                                {translateColumn(key)}
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
                        background: selectedRows[item.id]
                          ? colorScheme === 'light'
                            ? '#E0FBFF80'
                            : '#E0FBFF26'
                          : '',
                      }}
                      key={item.id}
                    >
                      <Table.Td
                        p={15}
                        style={{
                          lineHeight: 1,
                          width: '95px',
                          borderRight: `1px solid ${
                            colorScheme === 'light' ? '#f5f5f5' : '#424242'
                          }`,
                        }}
                      >
                        <Group p={0} gap={10}>
                          {groupActions.length > 0 && (
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
                          )}
                          {itemActions.length > 0 && (
                            <Menu>
                              <Menu.Target>
                                <ActionIcon variant="light" size="lg">
                                  <IconMenu2 />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                {itemActions.map((action, index) => (
                                  <Menu.Item
                                    key={index}
                                    onClick={() => action.onClick(item)}
                                    color={action.color}
                                    leftSection={action.leftSection}
                                  >
                                    {action.name}
                                  </Menu.Item>
                                ))}
                              </Menu.Dropdown>
                            </Menu>
                          )}
                        </Group>
                      </Table.Td>
                      {Object.entries(item)
                        .filter(([key, _]) => shownColumns[key])
                        .map(([key, value], i) => (
                          <Table.Td
                            p={15}
                            style={{
                              lineHeight: 1,
                              minWidth: `${key == 'id' ? '95px' : '150px'}`,
                              borderRight: `1px solid ${
                                colorScheme === 'light' ? '#f5f5f5' : '#424242'
                              }`,
                            }}
                            key={`${item.id.toString()}_${i}`}
                          >
                            <FormattedValue column={key} field={model[key]}>
                              {value}
                            </FormattedValue>
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
          <Box
            style={{
              borderTop: `1px solid ${
                colorScheme === 'light' ? '#ddd' : '#424242'
              }`,
            }}
          >
            <Group p={10} gap={10}>
              {groupActions.length > 0 && (
                <>
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
                      {groupActions.map((action, index) => (
                        <Menu.Item
                          key={index}
                          onClick={() =>
                            action.onClick(
                              Object.entries(selectedRows).reduce(
                                (accumulator, [key, value]) =>
                                  value
                                    ? [...accumulator, key as any]
                                    : accumulator,
                                [] as number[]
                              )
                            )
                          }
                          color={action.color}
                          leftSection={action.leftSection}
                        >
                          {action.name}
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                </>
              )}
            </Group>
          </Box>
        ) : (
          <Box>
            <Group p={10} gap={10}>
              <Skeleton animate={false} h={350} />
            </Group>
          </Box>
        )}
        <TablerPagination
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
    </>
  );
};

export const Tabler = memo(_Tabler) as typeof _Tabler;

import { ReactElement, useEffect, useState } from 'react';
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
} from '@mantine/core';
import {
  IconSettings,
  IconArrowNarrowUp,
  IconArrowNarrowDown,
  IconSelector,
  IconPlus,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { TablerPagination } from './TablerPagination';

export type TTablerProps<
  T extends Record<string, any> & { id: number }[] = []
> = {
  data: T;

  onEdit: () => void;
  addForm: ReactElement;
  onDelete: () => void;
};

export const Tabler = <T extends Record<string, any> & { id: number }[] = []>({
  data,
  onEdit,
  addForm,
  onDelete,
}: TTablerProps<T>) => {
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

  const [
    isShownColumnsDrawerOpened,
    { open: openShownColumnsDrawer, close: closeShownColumnsDrawer },
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
    }
  }, [cache]);

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

  console.log(paginatedData);

  return (
    <>
      <Paper withBorder mt="xl" pos="relative">
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
                            {value == null ? '' : value.toString()}
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
      <Drawer
        offset={8}
        position="right"
        radius="md"
        opened={isAddDrawerOpened}
        title={
          <Text fw={500} fz="lg">
            Добавление элемента
          </Text>
        }
        onClose={closeAddDrawer}
      >
        {addForm}
      </Drawer>
    </>
  );
};

import {
  Box,
  Group,
  ActionIcon,
  NumberInput,
  Select,
  Text,
} from '@mantine/core';
import {
  IconChevronLeftPipe,
  IconChevronLeft,
  IconChevronRight,
  IconChevronRightPipe,
} from '@tabler/icons-react';
import React from 'react';

export type TablePaginationPropsType = {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  firstPage: number;
  totalPages: number;
  lastPage: number;
  totalRecords: number;
  perPage: number;
  handlePerPageChange: (value: string | null) => void;
  handleCurrentPageChange: (value: string | number) => void;
};

export const TablePagination = ({
  firstPage,
  currentPage,
  setCurrentPage,
  totalPages,
  lastPage,
  totalRecords,
  perPage,
  handleCurrentPageChange,
  handlePerPageChange,
}: TablePaginationPropsType) => {
  return (
    <Box style={{ borderTop: '1px solid #ddd' }}>
      <Group p={10} gap={10}>
        <Group gap={10}>
          <ActionIcon
            onClick={() => setCurrentPage(firstPage)}
            disabled={currentPage == firstPage}
            size="lg"
          >
            <IconChevronLeftPipe />
          </ActionIcon>
          <ActionIcon
            onClick={() => setCurrentPage((v) => v - 1)}
            disabled={currentPage == firstPage}
            size="lg"
          >
            <IconChevronLeft />
          </ActionIcon>
          <Group gap={10}>
            <Text lh={1} fz="sm">
              Страница
            </Text>
            <NumberInput
              styles={{
                input: {
                  textAlign: 'center',
                },
              }}
              clampBehavior="strict"
              min={1}
              allowDecimal={false}
              hideControls
              max={totalPages}
              w={40}
              value={currentPage}
              onChange={handleCurrentPageChange}
            />
            <Text lh={1} fz="sm">
              из {totalPages}
            </Text>
          </Group>
          <ActionIcon
            onClick={() => setCurrentPage((v) => v + 1)}
            disabled={currentPage == lastPage || currentPage > totalPages}
            size="lg"
          >
            <IconChevronRight />
          </ActionIcon>
          <ActionIcon
            onClick={() => setCurrentPage(lastPage)}
            disabled={currentPage == lastPage || currentPage > totalPages}
            size="lg"
          >
            <IconChevronRightPipe />
          </ActionIcon>
        </Group>
        <Group ml="auto" gap={10}>
          <Text lh={1} fz="sm">
            На странице:
          </Text>
          <Select
            w={65}
            value={perPage.toString()}
            onChange={handlePerPageChange}
            data={['5', '10', '15', '20']}
          />
          <Text lh={1} fz="sm">
            Всего: {totalRecords}
          </Text>
        </Group>
      </Group>
    </Box>
  );
};

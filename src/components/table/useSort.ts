import { useState } from 'react';

const sort = <T extends Record<string, any>>({
  data,
  sortBy,
  sortDirection,
}: {
  data: T[];
  sortBy: string;
  sortDirection: 'desc' | 'asc';
}) => {
  //! Shallow copy no need to go deep
  const _data = [...data] as T[];

  const _sort = (a: T, b: T) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === bValue) {
      return 0;
    }

    if (typeof aValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    //! TODO: Dates!!!
    if (typeof aValue === 'string') {
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
    }

    return 0;
  };

  _data.sort(_sort);

  return _data;
};

export type useSortPropsType<T extends Record<string, any>> = {
  initialSortBy: string;
  initialSortDirection?: 'desc' | 'asc';
  initialData: T[];
};

export const useSort = <T extends Record<string, any>>({
  initialData,
  initialSortBy,
  initialSortDirection = 'asc',
}: useSortPropsType<T>) => {
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>(
    initialSortDirection
  );

  return {
    sortedData: sort<T>({
      data: initialData,
      sortBy,
      sortDirection,
    }),
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
  };
};

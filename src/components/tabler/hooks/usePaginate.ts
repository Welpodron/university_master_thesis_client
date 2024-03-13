import { useCallback, useState } from 'react';

const paginate = <T>({
  data,
  currentPage,
  perPage,
}: {
  data: T[];
  currentPage: number;
  perPage: number;
}) => {
  if (data.length < perPage) {
    return {
      paginatedData: data,
      firstPage: 1,
      lastPage: 1,
      totalPages: 1,
    };
  }

  const totalPages = Math.ceil(data.length / perPage);

  if (currentPage > totalPages) {
    return {
      paginatedData: data,
      firstPage: 1,
      lastPage: 1,
      totalPages: 1,
    };
  }

  const result: T[] = [];

  for (
    let i = (currentPage - 1) * perPage;
    i < (currentPage - 1) * perPage + perPage;
    i++
  ) {
    if (i >= data.length) {
      break;
    }
    result.push(data[i]);
  }

  return {
    firstPage: 1,
    totalPages,
    lastPage: totalPages,
    paginatedData: result,
  };
};

export type usePaginatePropsType<T> = {
  initialPerPage?: number;
  initialCurrentPage?: number;
  initialData: T[];
};

export const usePaginate = <T>({
  initialData,
  initialPerPage = 5,
  initialCurrentPage = 1,
}: usePaginatePropsType<T>) => {
  const [perPage, setPerPage] = useState(initialPerPage);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);

  const handlePerPageChange = useCallback((value: string | null) => {
    if (!value) {
      return;
    }
    setCurrentPage(1);
    setPerPage(parseInt(value.trim()));
  }, []);

  const handleCurrentPageChange = useCallback((value: string | number) => {
    if (!value) {
      return;
    }
    setCurrentPage(typeof value === 'string' ? parseInt(value.trim()) : value);
  }, []);

  return {
    ...paginate<T>({
      data: initialData,
      perPage,
      currentPage,
    }),
    currentPage,
    setCurrentPage,
    handleCurrentPageChange,
    perPage,
    setPerPage,
    handlePerPageChange,
  };
};

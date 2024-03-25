const isISODate = (value: string) => {
  try {
    return new Date(Date.parse(value)).toISOString() === value;
  } catch (_) {
    return false;
  }
};

const complex = ({
  originalValue,
  filterValue,
}: {
  originalValue: any;
  filterValue: any;
}) => {
  if (Array.isArray(filterValue)) {
    if (!filterValue.length) {
      return true;
    }

    return filterValue.some((value) => value === originalValue);
  }

  if (typeof originalValue === 'string') {
    if (filterValue instanceof Date && isISODate(originalValue)) {
      const date = new Date(originalValue);
      if (date.getFullYear() !== filterValue.getFullYear()) {
        return false;
      }
      if (date.getMonth() !== filterValue.getMonth()) {
        return false;
      }
      if (date.getDate() !== filterValue.getDate()) {
        return false;
      }
      return true;
    }

    if (
      typeof filterValue === 'string' &&
      originalValue.includes(filterValue)
    ) {
      return true;
    }
  }

  return originalValue === filterValue;
};

const filter = <T extends Record<string, any>>({
  data,
  filter,
}: {
  data: T[];
  filter: {
    [k: string]: any;
  };
}) => {
  if (!data.length) {
    return data;
  }

  const filterEntries = Object.entries(filter).filter(
    ([_, value]) => value != null
  );

  if (!filterEntries.length) {
    return data;
  }

  return data.filter((row) =>
    filterEntries.every(([key, filterValue]) =>
      complex({ originalValue: row[key], filterValue })
    )
  );
};

export type useSortPropsType<T extends Record<string, any>> = {
  filterObject: {
    [k: string]: any;
  };
  initialData: T[];
};

export const useFilter = <T extends Record<string, any>>({
  initialData,
  filterObject,
}: useSortPropsType<T>) => {
  return {
    filteredData: filter<T>({ data: initialData, filter: filterObject }),
  };
};

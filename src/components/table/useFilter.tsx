export type useFilterPropsType<T> = {
  initialData: T[];
  initialFilter?: Record<string, any>;
};

export const useFilter = <T,>({
  initialData,
  initialFilter,
}: useFilterPropsType<T>) => {};

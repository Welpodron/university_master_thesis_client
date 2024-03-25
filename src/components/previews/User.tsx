import { useGetUserQuery } from '@/redux/services/api';
import { NumberInput, Stack, TextInput } from '@mantine/core';

export const User = ({ userId }: { userId: number }) => {
  const { data, isLoading: loading, error } = useGetUserQuery(userId);

  console.log(data);

  return (
    <Stack pos="relative">
      {data && (
        <>
          <NumberInput value={data.id} label="Идентификатор" readOnly={true} />
          <TextInput value={data.name} label="ФИО" readOnly={true} />
        </>
      )}
    </Stack>
  );
};

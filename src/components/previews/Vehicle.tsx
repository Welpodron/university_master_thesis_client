import { useGetVehicleQuery } from '@/redux/services/api';
import { NumberInput, Stack, TextInput } from '@mantine/core';

export const Vehicle = ({ vehicleId }: { vehicleId: number }) => {
  const { data, isLoading: loading, error } = useGetVehicleQuery(vehicleId);

  return (
    <Stack pos="relative">
      {data && (
        <>
          <NumberInput value={data.id} label="Идентификатор" readOnly={true} />
          <NumberInput
            value={data.capacity}
            label="Вместимость"
            readOnly={true}
          />
          <TextInput value={data.name} label="Название" readOnly={true} />
        </>
      )}
    </Stack>
  );
};

import { useCallback, useEffect, useState } from 'react';

type Task = {
  id: number;
  latitude: number;
  longitude: number;
  demand: number;
};

import API from '@/api/API';
import { Tabler } from '@/components/tabler/Tabler';
import { useForm } from '@mantine/form';
import { LatLngExpression } from 'leaflet';
import { MapInput } from '@/components/forms/map-input/MapInput';
import { Stack, NumberInput, Button } from '@mantine/core';

export const Tasks = () => {
  const [data, setData] = useState<Task[]>([]);

  const addForm = useForm<{
    coordinates: LatLngExpression | null;
    demand: number | null;
  }>({
    initialValues: {
      coordinates: null,
      demand: null,
    },
  });

  const [isAddFormSubmitting, setIsAddFormSubmitting] = useState(false);

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
      setIsAddFormSubmitting(true);

      (async () => {
        try {
          const res = await API.post<Task>('/task', {
            latitude: parseFloat((coordinates as number[])[0].toFixed(6)),
            longitude: parseFloat((coordinates as number[])[1].toFixed(6)),
            demand,
          });

          setData((cache) => [...cache, res.data]);
        } catch (error) {
          console.error(error);
        } finally {
          setIsAddFormSubmitting(false);
        }
      })();
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const result = await API.get<Task[]>('/tasks', {
          signal: controller.signal,
        });

        setData(result.data);
      } catch (error) {
        if (!controller.signal?.aborted) {
          console.error(error);
        }
      } finally {
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Tabler
      {...{
        data,
        addForm: (
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
        ),
        onDelete: () => {},
        onEdit: () => {},
      }}
    />
  );
};

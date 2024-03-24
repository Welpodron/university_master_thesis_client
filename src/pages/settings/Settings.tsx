import { MapInput } from '@/components/forms/map-input/MapInput';
import { useGetSettingsQuery } from '@/redux/services/api';
import { exportData } from '@/utils';
import {
  Alert,
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import {
  IconDownload,
  IconInfoCircle,
  IconKey,
  IconLetterA,
  IconRoute,
} from '@tabler/icons-react';
import { LatLngExpression } from 'leaflet';
import { useEffect } from 'react';

export const Settings = () => {
  const { data, isLoading: loading, error } = useGetSettingsQuery(undefined);

  const editForm = useForm<{
    id: number;
    depotLocation: LatLngExpression | null;
    routingKey: string;
    // routingAlgo: string;
    routingAlgoIterations: number | null;
  }>({
    initialValues: {
      id: NaN,
      depotLocation: null,
      routingKey: '',
      // routingAlgo: '',
      routingAlgoIterations: null,
    },
  });

  const openConfirmAlgoModal = () =>
    modals.openConfirmModal({
      title: 'Подтвердите действие',
      centered: true,
      zIndex: 1002,
      withCloseButton: false,
      children: (
        <Text size="sm">
          При изменении параметров алгоритмизации возможно существенное
          изменение результата расчетов планирования маршрутов
        </Text>
      ),
      confirmProps: { color: 'red' },
      labels: { confirm: 'Подтвердить', cancel: 'Отмена' },
      onConfirm: () => {},
    });

  const openConfirmRoutingModal = () =>
    modals.openConfirmModal({
      title: 'Подтвердите действие',
      centered: true,
      zIndex: 1002,
      withCloseButton: false,
      children: (
        <Text size="sm">
          При изменении параметров маршрутизации весь кэш автоматической
          маршрутизации будет очищен!
        </Text>
      ),
      confirmProps: { color: 'red' },
      labels: { confirm: 'Подтвердить', cancel: 'Отмена' },
      onConfirm: () => {},
    });

  useEffect(() => {
    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Параметры системы';
  }, []);

  useEffect(() => {
    if (data) {
      editForm.setValues({
        ...data,
        depotLocation: JSON.parse(data.depotLocation),
      });
    }
  }, [data]);

  return (
    <>
      <Group>
        <Title>Параметры системы</Title>
        <Button
          onClick={() => {
            exportData(data);
          }}
          ml="auto"
          disabled={loading}
          loading={loading}
          leftSection={<IconDownload size={18} />}
        >
          Экспорт параметров
        </Button>
      </Group>
      <SimpleGrid
        style={{ alignItems: 'start' }}
        mt="xl"
        cols={{ base: 1, sm: 2 }}
      >
        <Paper pos="relative" withBorder radius="md" p="xl">
          <LoadingOverlay visible={loading} zIndex={1001} />
          <Group>
            <IconRoute />
            <Text fz="lg" fw={500}>
              Параметры маршрутизации
            </Text>
          </Group>
          <Text fz="xs" c="dimmed" mt={3} mb="lg">
            Расположение депо, параметры встроенного маршрутизатора
          </Text>
          <Alert
            mb={'lg'}
            variant="light"
            color="orange"
            title="Внимание!"
            icon={<IconInfoCircle />}
          >
            При изменении параметров маршрутизации весь кэш автоматической
            маршрутизации будет очищен!
          </Alert>
          <Stack>
            <Text mb={-10} fw={500}>
              Расположение депо
            </Text>
            <MapInput
              state={[
                editForm.getInputProps('depotLocation').value,
                editForm.getInputProps('depotLocation').onChange,
              ]}
              isDeleteEnabled={false}
            />
            <Text mb={-10} fw={500}>
              Автоматическая маршрутизация
            </Text>
            <TextInput
              required={true}
              placeholder="2b3c34591852190001cf6248e38fa34a35c74729b2d108b4eed5610b"
              label="Ключ OpenRouteService"
              rightSection={<IconKey size={18} />}
              {...editForm.getInputProps('routingKey')}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button
              onClick={() => openConfirmRoutingModal()}
              variant="light"
              color="red"
            >
              Сменить текущие параметры маршрутизации
            </Button>
          </Stack>
        </Paper>
        <Paper pos="relative" withBorder radius="md" p="xl">
          <LoadingOverlay visible={loading} zIndex={1001} />
          <Group>
            <IconLetterA />
            <Text fz="lg" fw={500}>
              Параметры алгоритмизации
            </Text>
          </Group>
          <Text fz="xs" c="dimmed" mt={3} mb="xl">
            Используемые при расчетах алгоритмы, их параметры
          </Text>
          <Stack mb="xl">
            {/* <Select
              label="Используемый алгоритм"
              placeholder="Используемый алгоритм"
              required={true}
              description="Рекомендуется использование ABC_CLARKE"
              data={['ABC_CLARKE', 'ABC_TABU', 'CLARKE', 'ANT']}
              {...editForm.getInputProps('routingAlgo')}
            /> */}
            <NumberInput
              label="Количество итераций"
              required={true}
              allowDecimal={false}
              min={1}
              description="Рекомендуемое значение 500"
              placeholder="500"
              {...editForm.getInputProps('routingAlgoIterations')}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button
              onClick={() => openConfirmAlgoModal()}
              variant="light"
              color="red"
            >
              Сменить текущие параметры алгоритмизации
            </Button>
          </Stack>
        </Paper>
      </SimpleGrid>
    </>
  );
};

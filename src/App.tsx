import '@mantine/core/styles.css';

import {
  Container,
  MantineProvider,
  Paper,
  Radio,
  Select,
  Stack,
  Tabs,
  Text,
} from '@mantine/core';
import { _Table } from './components/table/Table';
import { ModalsProvider } from '@mantine/modals';
import { TimeInput } from '@mantine/dates';

export default function App() {
  return (
    <MantineProvider>
      <ModalsProvider>
        <Container p="xl">
          {/* <Paper withBorder mt="xl" pos="relative">
            <Stack p={10}>
              <Text>Параметры маршрутизации:</Text>
              <Text>Автоматический расчет:</Text>
              <TimeInput description="Каждый день в" />
              <Text>Используемый алгоритм:</Text>
              <Select
                placeholder="Pick value"
                data={['React', 'Angular', 'Vue', 'Svelte']}
              />
              <Text>Режим оптимизации:</Text>
              <Radio checked label="Расстояние" />
            </Stack>
          </Paper> */}
          <_Table></_Table>
        </Container>
      </ModalsProvider>
    </MantineProvider>
  );
}

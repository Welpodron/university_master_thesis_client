import '@mantine/core/styles.css';

import {
  Button,
  Container,
  MantineProvider,
  Paper,
  Radio,
  Select,
  Stack,
  Tabs,
  Text,
  Modal,
} from '@mantine/core';
import { _Table } from './components/table/Table';
import { ModalsProvider } from '@mantine/modals';
import { TimeInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { Calculator } from './components/calculator/Calculator';
import { useEffect, useRef } from 'react';

export default function App() {
  const [opened, { open, close }] = useDisclosure(false);

  const mounted = useRef(false);

  useEffect(() => {
    let events: EventSource | undefined;

    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    (() => {
      events = new EventSource('http://localhost:3000/_debug');

      console.log(events);

      events.onopen = (event: Event) => {
        console.log('Opened', event);
      };

      events.onmessage = (event: MessageEvent) => {
        console.log(JSON.parse(event.data));
      };

      events.onerror = (event: Event) => {
        console.log('Error', event);
      };
    })();

    return () => {
      if (events && events instanceof EventSource) {
        events.close();
      }
    };
  }, []);

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
          <Button onClick={open}>Рассчитать</Button>

          <Modal
            opened={opened}
            onClose={close}
            styles={{
              content: {
                minWidth: '100%',
                minHeight: '100%',
              },
            }}
            title={
              <Text fw={500} fz="lg">
                Результат расчетов
              </Text>
            }
            centered
          >
            <Calculator />
          </Modal>
          <_Table></_Table>
        </Container>
      </ModalsProvider>
    </MantineProvider>
  );
}

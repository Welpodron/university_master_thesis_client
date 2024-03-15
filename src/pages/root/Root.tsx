import {
  ActionIcon,
  AppShell,
  Burger,
  Group,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconClipboardList,
  IconLogin,
  IconLogout,
  IconRobot,
  IconSun,
  IconTruck,
} from '@tabler/icons-react';
import { Link, Outlet } from 'react-router-dom';

export const Root = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 85, breakpoint: 0 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Tooltip color="red" label="Выход">
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === 'light' ? 'dark' : 'light'
                )
              }
              variant="light"
              color="red"
              size="xl"
            >
              <IconSun stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack align="center">
          <Tooltip label="Заявки">
            <ActionIcon component={Link} to="/tasks" variant="light" size="xl">
              <IconClipboardList stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Транспорт">
            <ActionIcon
              component={Link}
              to="/vehicles"
              variant="light"
              size="xl"
            >
              <IconTruck stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Агенты">
            <ActionIcon component={Link} to="/jobs" variant="light" size="xl">
              <IconRobot stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Stack>
        <Stack mt="auto" align="center">
          <Tooltip label="Вход">
            <ActionIcon component={Link} to="/login" variant="light" size="xl">
              <IconLogin stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip color="red" label="Выход">
            <ActionIcon variant="light" color="red" size="xl">
              <IconLogout stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

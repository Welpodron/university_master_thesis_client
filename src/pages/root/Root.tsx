import {
  ActionIcon,
  AppShell,
  Burger,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure, useFullscreen } from '@mantine/hooks';
import {
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconClipboardList,
  IconListNumbers,
  IconLogin,
  IconLogout,
  IconMaximize,
  IconMoon,
  IconRobot,
  IconRoute,
  IconSettings,
  IconSun,
  IconTruck,
  IconUser,
  IconUsers,
} from '@tabler/icons-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const Root = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  const { toggle: toggleFullScreen, fullscreen } = useFullscreen();

  const location = useLocation();

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 75, breakpoint: 0 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group ml="auto">
            <Tooltip label="Экранный режим">
              <ActionIcon onClick={toggleFullScreen} variant="light" size="xl">
                {fullscreen ? (
                  <IconArrowsMinimize stroke={1.5} />
                ) : (
                  <IconArrowsMaximize stroke={1.5} />
                )}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Цветовая схема">
              <ActionIcon
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === 'light' ? 'dark' : 'light'
                  )
                }
                variant="light"
                color={computedColorScheme === 'light' ? 'indigo' : 'yellow'}
                size="xl"
              >
                {computedColorScheme === 'dark' ? (
                  <IconSun stroke={1.5} />
                ) : (
                  <IconMoon stroke={1.5} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar
        p="md"
        bg={computedColorScheme === 'light' ? 'gray.0' : 'dark.9'}
      >
        <Stack align="center">
          <Tooltip label="Назначения">
            <ActionIcon
              component={Link}
              to="/assignments"
              variant="light"
              size="xl"
            >
              <IconListNumbers stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Заявки">
            <ActionIcon component={Link} to="/tasks" variant="light" size="xl">
              <IconClipboardList stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Маршрутизация">
            <ActionIcon
              component={Link}
              to="/routing"
              variant="light"
              size="xl"
            >
              <IconRoute stroke={1.5} />
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
          <Tooltip label="Сотрудники">
            <ActionIcon component={Link} to="/users" variant="light" size="xl">
              <IconUsers stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Параметры системы">
            <ActionIcon
              component={Link}
              to="/settings"
              variant="light"
              size="xl"
            >
              <IconSettings stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Stack>
        <Stack mt="auto" align="center">
          <Tooltip label="Аккаунт">
            <ActionIcon
              component={Link}
              to="/personal"
              variant="light"
              size="xl"
            >
              <IconUser stroke={1.5} />
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
        {location.pathname === '/' && (
          <>
            <Title>
              Административная панель системы планирования маршрутов
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                Назначения
              </Card>
              <Card>Транспортные заявки</Card>
              <Card>Маршрутизация</Card>
              <Card>Транспорт</Card>
              <Card>Агенты</Card>
              <Card>Сотрудники</Card>
              <Card>Параметры системы</Card>
            </SimpleGrid>
          </>
        )}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

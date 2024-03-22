import {
  ActionIcon,
  AppShell,
  Burger,
  Card,
  Center,
  Group,
  Paper,
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
  IconArrowLeft,
  IconArrowRight,
  IconArrowsMaximize,
  IconArrowsMinimize,
  IconClipboardList,
  IconHome,
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
  TablerIconsProps,
} from '@tabler/icons-react';
import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const locations = [
  {
    url: 'assignments',
    name: 'Назначения',
    icon: (props: TablerIconsProps) => <IconListNumbers {...props} />,
  },
  {
    url: 'tasks',
    name: 'Заявки',
    icon: (props: TablerIconsProps) => <IconClipboardList {...props} />,
  },
  {
    url: 'routing',
    name: 'Маршрутизация',
    icon: (props: TablerIconsProps) => <IconRoute {...props} />,
  },
  {
    url: 'vehicles',
    name: 'Транспорт',
    icon: (props: TablerIconsProps) => <IconTruck {...props} />,
  },
  {
    url: 'jobs',
    name: 'Агенты',
    icon: (props: TablerIconsProps) => <IconRobot {...props} />,
  },
  {
    url: 'users',
    name: 'Сотрудники',
    icon: (props: TablerIconsProps) => <IconUsers {...props} />,
  },
  {
    url: 'settings',
    name: 'Параметры системы',
    icon: (props: TablerIconsProps) => <IconSettings {...props} />,
  },
];

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
          <Tooltip label="Главная">
            <ActionIcon component={Link} to={`/`} variant="light" size="xl">
              <IconHome stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          {locations.map((location) => (
            <Tooltip key={location.url} label={location.name}>
              <ActionIcon
                component={Link}
                to={`/${location.url}`}
                variant="light"
                size="xl"
              >
                {location.icon({ stroke: 1.5 })}
              </ActionIcon>
            </Tooltip>
          ))}
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
            <Title mb="xl">Страницы</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
              {locations.map((location) => (
                <Link key={location.url} to={`/${location.url}`}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section>
                      <Center h={250}>
                        {location.icon({ stroke: 1, size: '8rem' })}
                      </Center>
                    </Card.Section>
                    <Group gap={5}>
                      <Text fw={500} size="lg">
                        {location.name}
                      </Text>
                      <IconArrowRight />
                    </Group>
                  </Card>
                </Link>
              ))}
            </SimpleGrid>
          </>
        )}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

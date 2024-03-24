import { AppDispatch, RootState } from '@/redux/store';
import { authLogout } from '@/redux/thunks/auth';
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
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useLocation } from 'react-router-dom';

const locations = [
  {
    url: 'works',
    name: 'Назначения',
    role: 'DRIVER',
    icon: (props: TablerIconsProps) => <IconListNumbers {...props} />,
  },
  {
    url: 'assignments',
    name: 'Назначения',
    role: 'MANAGER',
    icon: (props: TablerIconsProps) => <IconListNumbers {...props} />,
  },
  {
    url: 'tasks',
    name: 'Заявки',
    role: 'MANAGER',
    icon: (props: TablerIconsProps) => <IconClipboardList {...props} />,
  },
  {
    url: 'routing',
    name: 'Маршрутизация',
    role: 'MANAGER',
    icon: (props: TablerIconsProps) => <IconRoute {...props} />,
  },
  {
    url: 'vehicles',
    name: 'Транспорт',
    role: 'MANAGER',
    icon: (props: TablerIconsProps) => <IconTruck {...props} />,
  },
  // {
  //   url: 'jobs',
  //   name: 'Агенты',
  //   role: 'MANAGER',
  //   icon: (props: TablerIconsProps) => <IconRobot {...props} />,
  // },
  {
    url: 'users',
    name: 'Персонал',
    role: 'MANAGER',
    icon: (props: TablerIconsProps) => <IconUsers {...props} />,
  },
  {
    url: 'settings',
    name: 'Параметры системы',
    role: 'MANAGER',
    icon: (props: TablerIconsProps) => <IconSettings {...props} />,
  },
];

export const Root = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  const dispatch = useDispatch<AppDispatch>();

  const { toggle: toggleFullScreen, fullscreen } = useFullscreen();

  const { user } = useSelector((state: RootState) => state.auth);

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
          {user &&
            locations.map((location) =>
              user.role == location.role ? (
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
              ) : (
                <Fragment key={location.url}></Fragment>
              )
            )}
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
            <ActionIcon
              onClick={() => dispatch(authLogout())}
              variant="light"
              color="red"
              size="xl"
            >
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
              {user && user.role == 'MANAGER' ? (
                locations.map((location) =>
                  user.role == location.role ? (
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
                  ) : (
                    <Fragment key={location.url}></Fragment>
                  )
                )
              ) : (
                <>
                  <Link to={`/works`}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Center h={250}>
                          <IconListNumbers stroke={1} size="8rem" />
                        </Center>
                      </Card.Section>
                      <Group gap={5}>
                        <Text fw={500} size="lg">
                          Назначения
                        </Text>
                        <IconArrowRight />
                      </Group>
                    </Card>
                  </Link>
                  <Link to={`/personal`}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                      <Card.Section>
                        <Center h={250}>
                          <IconUser stroke={1} size="8rem" />
                        </Center>
                      </Card.Section>
                      <Group gap={5}>
                        <Text fw={500} size="lg">
                          Персональный раздел
                        </Text>
                        <IconArrowRight />
                      </Group>
                    </Card>
                  </Link>
                </>
              )}
            </SimpleGrid>
          </>
        )}
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

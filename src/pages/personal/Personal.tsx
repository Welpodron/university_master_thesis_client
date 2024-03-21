import {
  Button,
  Group,
  NumberInput,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { useEffect } from 'react';

export const Personal = () => {
  useEffect(() => {
    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Персональный раздел';
  }, []);

  return (
    <>
      <Title>Персональный раздел</Title>
      <SimpleGrid
        style={{ alignItems: 'start' }}
        mt="xl"
        cols={{ base: 1, sm: 2 }}
      >
        <Paper withBorder radius="md" p="xl">
          <Group>
            <IconUser />
            <Text fz="lg" fw={500}>
              Персональные данные
            </Text>
          </Group>
          <Text fz="xs" c="dimmed" mt={3} mb="lg">
            Контактные данные, а также имя
          </Text>
          <Stack>
            <NumberInput
              label="Идентификатор пользователя"
              readOnly={true}
              disabled={true}
              value={1}
            />
            <TextInput
              label="Имя"
              placeholder="Иван"
              description="Ваше имя"
              required={true}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="example@mail.com"
              description="Ваш Email"
              required={true}
              rightSection={<IconMail size={18} />}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button variant="light" color="red">
              Сменить текущие данные
            </Button>
          </Stack>
        </Paper>
        <Paper withBorder radius="md" p="xl">
          <Group>
            <IconLock />
            <Text fz="lg" fw={500}>
              Параметры безопасности
            </Text>
          </Group>
          <Text fz="xs" c="dimmed" mt={3} mb="xl">
            Параметры безопасности аккаунта
          </Text>
          <Stack mb="xl">
            <PasswordInput
              label="Текущий пароль"
              placeholder="Введите ваш текущий пароль"
              description="Ваш текущий пароль"
              required={true}
            />
            <PasswordInput
              label="Новый пароль"
              placeholder="Введите ваш новый пароль"
              description="Ваш новый пароль"
              required={true}
            />
            <PasswordInput
              label="Повтор нового пароля"
              placeholder="Введите ваш новый пароль еще раз"
              description="Ваш новый пароль"
              required={true}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button variant="light" color="red">
              Сменить текущий пароль
            </Button>
          </Stack>
          <Button w="100%" variant="light" color="red">
            Выйти из аккаунта
          </Button>
        </Paper>
      </SimpleGrid>
    </>
  );
};

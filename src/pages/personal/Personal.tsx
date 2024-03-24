import {
  useGetPersonalQuery,
  useUpdatePersonalMutation,
} from '@/redux/services/api';
import {
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { modals } from '@mantine/modals';
import { authLogout } from '@/redux/thunks/auth';

export const Personal = () => {
  const editForm = useForm<{
    id: number;
    email: string;
    pass: string;
    passNew: string;
    passNewConfirm: string;
  }>({
    initialValues: {
      id: NaN,
      email: '',
      pass: '',
      passNew: '',
      passNewConfirm: '',
    },
  });

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data,
    isLoading: loading,
    error,
  } = useGetPersonalQuery(user ? user.id : -1);
  const [updatePersonal, { isLoading: isUpdating }] =
    useUpdatePersonalMutation();

  useEffect(() => {
    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Персональный раздел';
  }, []);

  useEffect(() => {
    if (data) {
      editForm.setValues({
        ...data,
      });
    }
  }, [data]);

  const openConfirmEmailModal = () =>
    modals.openConfirmModal({
      title: 'Подтвердите действие',
      centered: true,
      zIndex: 1002,
      withCloseButton: false,
      children: (
        <Text size="sm">
          При изменении email все уведомления, приходящие на аккаунт, будут
          отправляться на новый email адрес
        </Text>
      ),
      confirmProps: { color: 'red' },
      labels: { confirm: 'Подтвердить', cancel: 'Отмена' },
      onConfirm: () => {},
    });

  const openConfirmPassModal = () =>
    modals.openConfirmModal({
      title: 'Подтвердите действие',
      centered: true,
      zIndex: 1002,
      withCloseButton: false,
      children: (
        <Text size="sm">
          При изменении пароля для входа авторизация по старому паролю больше не
          будет возможна!
        </Text>
      ),
      confirmProps: { color: 'red' },
      labels: { confirm: 'Подтвердить', cancel: 'Отмена' },
      onConfirm: () => {},
    });

  return (
    <>
      <Title>Персональный раздел</Title>
      <SimpleGrid
        style={{ alignItems: 'start' }}
        mt="xl"
        cols={{ base: 1, sm: 2 }}
      >
        <Paper pos="relative" withBorder radius="md" p="xl">
          <LoadingOverlay visible={loading} zIndex={1001} />
          <Group>
            <IconUser />
            <Text fz="lg" fw={500}>
              Персональные данные
            </Text>
          </Group>
          <Text fz="xs" c="dimmed" mt={3} mb="lg">
            Контактные данные
          </Text>
          <Stack>
            <NumberInput
              label="Идентификатор пользователя"
              readOnly={true}
              disabled={true}
              {...editForm.getInputProps('id')}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="example@mail.com"
              description="Ваш Email"
              required={true}
              rightSection={<IconMail size={18} />}
              {...editForm.getInputProps('email')}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button
              disabled={isUpdating}
              loading={isUpdating}
              variant="light"
              color="red"
              onClick={() => openConfirmEmailModal()}
            >
              Сменить текущие данные
            </Button>
          </Stack>
        </Paper>
        <Paper pos="relative" withBorder radius="md" p="xl">
          <LoadingOverlay visible={loading} zIndex={1001} />
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
              {...editForm.getInputProps('pass')}
            />
            <PasswordInput
              label="Новый пароль"
              placeholder="Введите ваш новый пароль"
              description="Ваш новый пароль"
              required={true}
              {...editForm.getInputProps('passNew')}
            />
            <PasswordInput
              label="Повтор нового пароля"
              placeholder="Введите ваш новый пароль еще раз"
              description="Ваш новый пароль"
              required={true}
              {...editForm.getInputProps('passNewConfirm')}
            />
            <Text fz="xs" c="dimmed">
              <span style={{ color: 'red' }}>*</span> - поля, обязательные для
              заполнения
            </Text>
            <Button
              disabled={isUpdating}
              loading={isUpdating}
              variant="light"
              color="red"
              onClick={() => openConfirmPassModal()}
            >
              Сменить текущий пароль
            </Button>
          </Stack>
          <Button
            onClick={() => dispatch(authLogout())}
            w="100%"
            variant="light"
            color="red"
          >
            Выйти из аккаунта
          </Button>
        </Paper>
      </SimpleGrid>
    </>
  );
};

import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Center,
  Alert,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { authLogin } from '@/store/thunks/auth';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login = () => {
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const loginForm = useForm<{
    email: string;
    pass: string;
  }>({
    initialValues: {
      email: '',
      pass: '',
    },
    validate: {
      pass: (value) =>
        value.length < 1 ? 'Поле обязательно для заполнения' : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Некорректный email'),
    },
  });

  const handleLoginFormSubmit = useCallback(
    ({ email, pass }: { email: string; pass: string }) => {
      if (!email || !pass) {
        return;
      }

      (async () => {
        try {
          await dispatch(authLogin({ email, pass }));

          navigate(from, { replace: true });
        } catch (error) {
          console.error(error);
        }
      })();
    },
    []
  );
  // const handleLoginFormSubmit = useCallback(
  //   ({ email, pass }: { email: string; pass: string }) => {
  //     if (!email || !pass) {
  //       return;
  //     }

  //     setIsLoginFormSubmitting(true);

  //     (async () => {
  //       try {
  //         const result = await API.post('/login', {
  //           email,
  //           pass,
  //         });

  //         setUser({ id: result.data.id, role: result.data.role });

  //         localStorage.setItem('token', result.data.token);

  //         navigate('/');
  //       } catch (error) {
  //         console.error(error);
  //       } finally {
  //         setIsLoginFormSubmitting(false);
  //       }
  //     })();
  //   },
  //   []
  // );

  return (
    <Center>
      <form onSubmit={loginForm.onSubmit(handleLoginFormSubmit)}>
        <Paper w={320} withBorder shadow="md" p={25} mt={10} radius="md">
          <Stack>
            {error && (
              <Alert icon={<IconAlertTriangle />} variant="light" color="red">
                {error.message}
              </Alert>
            )}
            <TextInput
              type="email"
              label="Email"
              placeholder="example@mail.com"
              required
              {...loginForm.getInputProps('email')}
            />
            <PasswordInput
              label="Пароль"
              placeholder="Ваш пароль"
              required
              {...loginForm.getInputProps('pass')}
            />
            <Button
              type="submit"
              disabled={loading || !loginForm.isValid()}
              loading={loading}
              fullWidth
            >
              Войти
            </Button>
          </Stack>
        </Paper>
      </form>
    </Center>
  );
};

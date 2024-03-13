import { Paper, TextInput, PasswordInput, Button, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback, useContext, useState } from 'react';

import API from '@/api/API';
import { UserSetterContext } from '@/providers/auth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const setUser = useContext(UserSetterContext);

  const navigate = useNavigate();

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

  const [isLoginFormSubmitting, setIsLoginFormSubmitting] = useState(false);

  const handleLoginFormSubmit = useCallback(
    ({ email, pass }: { email: string; pass: string }) => {
      if (!email || !pass) {
        return;
      }

      setIsLoginFormSubmitting(true);

      (async () => {
        try {
          const result = await API.post('/login', {
            email,
            pass,
          });

          setUser(result.data);
          navigate('/');
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoginFormSubmitting(false);
        }
      })();
    },
    []
  );

  return (
    <Center>
      <form onSubmit={loginForm.onSubmit(handleLoginFormSubmit)}>
        <Paper w={320} withBorder shadow="md" p={25} mt={10} radius="md">
          <TextInput
            type="email"
            label="Email"
            placeholder="example@mail.ru"
            required
            {...loginForm.getInputProps('email')}
          />
          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            required
            mt="md"
            {...loginForm.getInputProps('pass')}
          />
          <Button
            type="submit"
            disabled={isLoginFormSubmitting || !loginForm.isValid()}
            loading={isLoginFormSubmitting}
            fullWidth
            mt="xl"
          >
            Войти
          </Button>
        </Paper>
      </form>
    </Center>
  );
};

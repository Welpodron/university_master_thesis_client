import { useCallback, useEffect, useMemo } from 'react';

import { useForm } from '@mantine/form';
import {
  Stack,
  NumberInput,
  Button,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { Tabler, TablerEditor } from '@/components/tabler';
import { TUser } from '@/constants';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  RESTaddUser,
  RESTdeleteUsers,
  RESTgetUsers,
} from '@/redux/thunks/users';

export const Users = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, model, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  const addForm = useForm<{
    name: string;
    email: string;
  }>({
    initialValues: {
      name: '',
      email: '',
    },
  });

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const handleAddFormSubmit = useCallback(
    ({ name, email }: { name: string; email: string }) => {
      if (!name || !email) {
        return;
      }

      (async () => {
        try {
          await dispatch(
            RESTaddUser({
              name,
              email,
            })
          );
          closeAddDrawer();
          addForm.reset();
        } catch (error) {
          console.error(error);
        }
      })();
    },
    []
  );

  const handleDeleteSubmit = useCallback(({ ids }: { ids: number[] }) => {
    if (Array.isArray(ids)) {
      (async () => {
        try {
          await dispatch(RESTdeleteUsers(ids));
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, []);

  const openConfirmDeleteModal = ({ ids }: { ids: number[] }) =>
    modals.openConfirmModal({
      title: 'Подтвердите действие',
      centered: true,
      withCloseButton: false,
      children: (
        <Text size="sm">
          Данная операция не является обратимой при нажатии на кнопку
          "Подтвердить" вы осознаете последствия данного действия
        </Text>
      ),
      confirmProps: { color: 'red' },
      labels: { confirm: 'Подтвердить', cancel: 'Отмена' },
      onConfirm: () => {
        handleDeleteSubmit({ ids });
      },
    });

  useEffect(() => {
    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Сотрудники';

    (async () => {
      try {
        dispatch(RESTgetUsers());
      } catch (error) {
        console.log(error);
      }
    })();
  }, [dispatch]);

  const tableActions = useMemo(
    () => [
      {
        name: 'Добавить',
        leftSection: <IconPlus size={20} />,
        color: 'blue',
        onClick: () => {
          openAddDrawer();
        },
      },
    ],
    []
  );

  const groupActions = useMemo(
    () => [
      {
        name: 'Удалить',
        color: 'red',
        leftSection: <IconX size={20} />,
        onClick: (selectedIds: number[]) => {
          if (Array.isArray(selectedIds) && selectedIds.length > 0) {
            openConfirmDeleteModal({ ids: selectedIds });
          }
        },
      },
    ],
    []
  );

  const itemActions = useMemo(
    () => [
      {
        name: 'Удалить',
        color: 'red',
        leftSection: <IconX size={20} />,
        onClick: (item: TUser) => {
          openConfirmDeleteModal({ ids: [item.id] });
        },
      },
    ],
    []
  );

  return (
    <>
      <Title>Сотрудники</Title>
      <Tabler
        {...{
          loading,
          data,
          model,
          tableActions,
          groupActions,
          itemActions,
        }}
      />
      <TablerEditor
        type="add"
        opened={isAddDrawerOpened}
        onClose={closeAddDrawer}
      >
        <form onSubmit={addForm.onSubmit(handleAddFormSubmit)}>
          <Stack>
            <TextInput
              label="Имя"
              description="Имя пользователя"
              placeholder="Алексей"
              min={1}
              required={true}
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="Email"
              description="Email пользователя"
              placeholder="email@example.com"
              min={1}
              type="email"
              required={true}
              {...addForm.getInputProps('email')}
            />
            <Button
              disabled={loading}
              loading={loading}
              mt="auto"
              w="100%"
              type="submit"
            >
              Добавить
            </Button>
          </Stack>
        </form>
      </TablerEditor>
    </>
  );
};

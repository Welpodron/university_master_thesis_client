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
import { IconDownload, IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { Tabler, TablerEditor } from '@/components/tabler';
import { TUser } from '@/constants';
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from '@/redux/services/api';
import { exportData } from '@/utils';

export const Users = () => {
  const { data, isLoading: loading, error } = useGetUsersQuery(undefined);

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const addForm = useForm<{
    name: string;
    email: string;
  }>({
    initialValues: {
      name: '',
      email: '',
    },
  });

  const editForm = useForm<{
    id: number;
    name: string;
  }>({
    initialValues: {
      id: NaN,
      name: '',
    },
  });

  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const handleEditFormSubmit = useCallback(
    ({ name, id }: { name: string; id: number }) => {
      if (!name || !id) {
        return;
      }

      (async () => {
        try {
          await updateUser({ id, name });
          closeEditDrawer();
        } catch (error) {
          console.error(error);
        }
      })();
    },
    []
  );

  const handleAddFormSubmit = useCallback(
    ({ name, email }: { name: string; email: string }) => {
      if (!name || !email) {
        return;
      }

      (async () => {
        try {
          await createUser({ name, email });
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
          // await dispatch(RESTdeleteUsers(ids));
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
      'Персонал';
  }, []);

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
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: () => {
          exportData(data?.data);
        },
      },
    ],
    [data]
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
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: (selectedIds: number[]) => {
          if (Array.isArray(selectedIds) && selectedIds.length > 0) {
            if (data?.data) {
              exportData(
                data.data.filter((row) =>
                  selectedIds.some((id) => id == row.id)
                )
              );
            }
          }
        },
      },
    ],
    [data]
  );

  const itemActions = useMemo(
    () => [
      {
        name: 'Изменить',
        color: 'blue',
        leftSection: <IconPencil size={20} />,
        onClick: (item: TUser) => {
          editForm.setValues({
            id: item.id,
            name: item.name,
          });
          openEditDrawer();
        },
      },
      {
        name: 'Удалить',
        color: 'red',
        leftSection: <IconX size={20} />,
        onClick: (item: TUser) => {
          openConfirmDeleteModal({ ids: [item.id] });
        },
      },
      {
        name: 'Экспорт',
        color: 'blue',
        leftSection: <IconDownload size={20} />,
        onClick: (item: TUser) => {
          exportData([item]);
        },
      },
    ],
    []
  );

  return (
    <>
      <Title>Персонал</Title>
      <Tabler
        {...{
          loading,
          data: (data?.data as any) ?? [],
          model: data?.model ?? {},
          tableActions,
          groupActions,
          itemActions,
        }}
      />
      <TablerEditor
        type="edit"
        opened={isEditDrawerOpened}
        onClose={closeEditDrawer}
      >
        <form onSubmit={editForm.onSubmit(handleEditFormSubmit)}>
          <Stack>
            <TextInput
              label="ФИО"
              description="ФИО пользователя"
              placeholder="Иванов Иван Иванович"
              min={1}
              required={true}
              {...editForm.getInputProps('name')}
            />
            <Button
              disabled={isUpdating}
              loading={isUpdating}
              mt="auto"
              w="100%"
              type="submit"
            >
              Сохранить
            </Button>
          </Stack>
        </form>
      </TablerEditor>
      <TablerEditor
        type="add"
        opened={isAddDrawerOpened}
        onClose={closeAddDrawer}
      >
        <form onSubmit={addForm.onSubmit(handleAddFormSubmit)}>
          <Stack>
            <TextInput
              label="ФИО"
              description="ФИО пользователя"
              placeholder="Иванов Иван Иванович"
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
              disabled={isCreating}
              loading={isCreating}
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

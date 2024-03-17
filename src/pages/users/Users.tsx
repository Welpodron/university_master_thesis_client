import { useCallback, useEffect, useState } from 'react';

type TUser = {
  id: number;
  name: string;
};

import API from '@/api/API';
import { Tabler } from '@/components/tabler/Tabler';
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
import { IconPencil, IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { TModelField } from '@/constants';

export const Users = () => {
  const [model, setModel] = useState<Record<string, TModelField>>({});
  const [data, setData] = useState<TUser[]>([]);

  const addForm = useForm<{
    name: string;
    email: string;
  }>({
    initialValues: {
      name: '',
      email: '',
    },
  });

  const [isAddFormSubmitting, setIsAddFormSubmitting] = useState(false);

  const [isAddDrawerOpened, { open: openAddDrawer, close: closeAddDrawer }] =
    useDisclosure(false);

  const handleAddFormSubmit = useCallback(
    ({ name, email }: { name: string; email: string }) => {
      if (!name || !email) {
        return;
      }
      setIsAddFormSubmitting(true);

      (async () => {
        try {
          const res = await API.post<TUser>('/users', {
            name: name.trim(),
            email: email.trim(),
          });

          setData((data) => [...data, res.data]);
          closeAddDrawer();
        } catch (error) {
          console.error(error);
        } finally {
          setIsAddFormSubmitting(false);
        }
      })();
    },
    []
  );

  const handleDeleteSubmit = useCallback(({ ids }: { ids: number[] }) => {
    if (Array.isArray(ids)) {
      (async () => {
        try {
          await API.delete('/users', {
            data: { ids },
          });
          setData((data) => data.filter((row) => !ids.includes(row.id)));
        } catch (error) {
          console.error(error);
        } finally {
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
    const controllerData = new AbortController();
    const controllerModel = new AbortController();

    (document.head.querySelector('title') as HTMLTitleElement).textContent =
      'Сотрудники';

    (async () => {
      try {
        const result = await API.get('/_usersModel', {
          signal: controllerModel.signal,
        });

        console.log(result.data);

        setModel(result.data);
      } catch (error) {
        if (!controllerModel.signal?.aborted) {
          console.error(error);
        }
      }

      try {
        const result = await API.get<TUser[]>('/users', {
          signal: controllerData.signal,
        });

        setData(result.data);
      } catch (error) {
        if (!controllerData.signal?.aborted) {
          console.error(error);
        }
      }
    })();

    return () => {
      controllerData.abort();
      controllerModel.abort();
    };
  }, []);

  return (
    <>
      <Title>Сотрудники</Title>
      <Tabler
        {...{
          data,
          model,
          isAddDrawerOpened,
          openAddDrawer,
          closeAddDrawer,
          groupActions: [
            {
              name: 'Удалить',
              color: 'red',
              leftSection: <IconX size={20} />,
              onClick: (selectedIds) => {
                if (Array.isArray(selectedIds) && selectedIds.length > 0) {
                  openConfirmDeleteModal({ ids: selectedIds });
                }
              },
            },
          ],
          itemActions: [
            {
              name: 'Удалить',
              color: 'red',
              leftSection: <IconX size={20} />,
              onClick: (item) => {
                openConfirmDeleteModal({ ids: [item.id] });
              },
            },
          ],
          addForm: (
            <form onSubmit={addForm.onSubmit(handleAddFormSubmit)}>
              <Stack>
                <TextInput
                  label="Название"
                  description="Название транспорта"
                  placeholder="Волга"
                  min={1}
                  required={true}
                  {...addForm.getInputProps('name')}
                />
                <NumberInput
                  label="Вместимость"
                  description="Вместимость транспорта"
                  placeholder="1"
                  allowDecimal={false}
                  min={1}
                  required={true}
                  {...addForm.getInputProps('capacity')}
                />
                <Button
                  disabled={isAddFormSubmitting}
                  loading={isAddFormSubmitting}
                  mt="auto"
                  w="100%"
                  type="submit"
                >
                  Добавить
                </Button>
              </Stack>
            </form>
          ),
        }}
      />
    </>
  );
};

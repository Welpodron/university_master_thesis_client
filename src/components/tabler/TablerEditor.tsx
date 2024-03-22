import { Drawer, Text } from '@mantine/core';
import { ReactElement } from 'react';

export const TablerEditor = ({
  opened,
  onClose,
  children,
  type,
  title,
}: {
  children: ReactElement;
  opened: boolean;
  onClose: () => void;
  type: 'edit' | 'add';
  title?: string;
}) => {
  return (
    <Drawer
      offset={8}
      position="right"
      radius="md"
      opened={opened}
      title={
        <Text fw={500} fz="lg">
          {title ||
            (type === 'add'
              ? 'Добавление элемента'
              : 'Редактирование элемента')}
        </Text>
      }
      onClose={onClose}
    >
      {children}
    </Drawer>
  );
};

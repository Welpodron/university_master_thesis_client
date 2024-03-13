import { AppShell, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

export const Shell = () => {
  return (
    <MantineProvider>
      <ModalsProvider>
        <AppShell />
      </ModalsProvider>
      <Notifications position="bottom-center" autoClose={false} />
    </MantineProvider>
  );
};

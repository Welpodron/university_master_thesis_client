import { Button, Drawer, Group, JsonInput, Text, rem } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconDownload, IconJson, IconUpload, IconX } from '@tabler/icons-react';
import { ReactElement, useCallback, useState } from 'react';

function validateJson(value: string) {
  if (typeof value === 'string' && value.trim().length === 0) {
    return true;
  }

  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}

export const TablerImport = ({
  opened,
  onClose,
  onSubmit,
  loading,
}: {
  opened: boolean;
  onClose: () => void;
  onSubmit: (value: string, reset: () => void) => void;
  loading: boolean;
}) => {
  const [value, setValue] = useState('');

  const reset = useCallback(() => {
    setValue('');
  }, []);

  return (
    <Drawer
      offset={8}
      position="bottom"
      radius="md"
      size="90%"
      opened={opened}
      title={
        <Group gap={10}>
          <IconDownload />
          <Text fw={500} fz="lg">
            Импорт данных
          </Text>
        </Group>
      }
      onClose={onClose}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(value, reset);
        }}
      >
        <Dropzone
          onDrop={(files) => {
            if (!files.length) {
              return;
            }

            const file = files[0];

            const reader = new FileReader();

            reader.onload = () => {
              if (reader.result && typeof reader.result === 'string') {
                if (validateJson(reader.result)) {
                  setValue(
                    JSON.stringify!(JSON.parse!(reader.result), null, 2)
                  );
                }
              }
            };

            try {
              reader.readAsText(file);
            } catch (_) {}
          }}
          onReject={(files) => console.log('rejected files', files)}
          accept={['application/json']}
        >
          <Group
            justify="center"
            gap="xl"
            mih={230}
            style={{ pointerEvents: 'none' }}
          >
            <Dropzone.Accept>
              <IconUpload
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-blue-6)',
                }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-red-6)',
                }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconJson
                style={{
                  width: rem(52),
                  height: rem(52),
                  color: 'var(--mantine-color-dimmed)',
                }}
                stroke={1.5}
              />
            </Dropzone.Idle>
            <Text inline>
              Перетащите JSON файл в данную область или нажмите для выбора файла
              в системе
            </Text>
          </Group>
        </Dropzone>
        <JsonInput
          mt="xl"
          mb="xl"
          label="Ввод в ручном режиме"
          description="В данное поле можно ввести, а также скорректировать данные, которые будут импортированы"
          placeholder="Данные которые будут импортированы"
          validationError="Данный json не является валидным"
          formatOnBlur
          rows={12}
          value={value}
          onChange={setValue}
        />
        <Button
          disabled={!Boolean(value.trim().length) || loading}
          loading={loading}
          mt="auto"
          w="100%"
          type="submit"
        >
          Импорт
        </Button>
      </form>
    </Drawer>
  );
};

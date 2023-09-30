// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import {
  Box,
  MantineProvider,
  Group,
  Button,
  Code,
  Text,
  Stack,
  Title,
  List,
  NumberInput,
  Flex,
  TextInput,
  Paper,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { Map } from "./components/map/Map";
import { useCallback } from "react";

type Good = {
  weight: number;
  quantity: number;
  key: string;
};

//! location содержит координаты мировые в виде: [latitude, longitude] или [широта, долгота]
type Shipment = {
  location: [number, number] | null;
  key: string;
  goods: Good[];
};

export type FormValuesType = {
  shipments: Shipment[];
};

export default function App() {
  const form = useForm<FormValuesType>({
    initialValues: {
      shipments: [],
    },
  });

  const fields = form.values.shipments.map((item, index) => (
    <Paper withBorder p="lg" key={item.key}>
      <Stack>
        <Flex justify="space-between" align="center">
          <Text>Информация по отгрузке #{index + 1}:</Text>
          <Button
            color="red"
            onClick={() => form.removeListItem("shipments", index)}
          >
            Удалить отгрузку
          </Button>
        </Flex>
        <Text>Точка отгрузки:</Text>
        <TextInput
          label="Координаты [latitude, longitude] или [широта, долгота]"
          description="В дальнейшем можно будет вбить адрес а не координаты"
          value={JSON.stringify(form.values.shipments[index].location)}
          readOnly
        />
        <Map {...{ form, shipmentIndex: index }} />
        <Flex justify="space-between" align="center">
          <Text>Посылки:</Text>
          <Button
            onClick={() =>
              form.insertListItem(`shipments.${index}.goods`, {
                weight: null,
                quantity: null,
                key: randomId(),
              })
            }
          >
            Добавить посылку
          </Button>
        </Flex>
        {form.values.shipments[index].goods.map((good, goodIndex) => (
          <Paper p="lg" key={good.key}>
            <Flex justify="space-between" align="flex-end">
              <Group>
                <NumberInput
                  label="Количество"
                  description="Количество элементов / шт"
                  placeholder="1"
                  allowDecimal={false}
                  min={1}
                  {...form.getInputProps(
                    `shipments.${index}.goods.${goodIndex}.quantity`
                  )}
                />
                <NumberInput
                  label="Вес"
                  description="Вес элементов / кг"
                  placeholder="1"
                  min={0}
                  {...form.getInputProps(
                    `shipments.${index}.goods.${goodIndex}.weight`
                  )}
                />
              </Group>
              <Button
                color="red"
                onClick={() =>
                  form.removeListItem(`shipments.${index}.goods`, goodIndex)
                }
              >
                Удалить посылку
              </Button>
            </Flex>
          </Paper>
        ))}
      </Stack>
    </Paper>
  ));

  return (
    <MantineProvider>
      <form
        onSubmit={form.onSubmit(async (values) => {
          try {
            const response = await fetch("http://localhost:3000/cvrp", {
              method: "POST",
              body: JSON.stringify(values),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await response.json();
            if (response.status === 200 && response.ok) {
              alert(`Заявка успешно отправлена!`);
            } else {
              alert(`Ошибка отправки заявки! ${data.message}`);
            }
          } catch (error: any) {
            alert(`Ошибка отправки заявки! ${error.message}`);
          }
        })}
      >
        <Stack p="xl" maw={1000} mx="auto">
          <Title>Тестовая форма заявки CVRP:</Title>

          <Text>
            Вся контактная информация по клиенту заполняется при регистрации в
            системе. Данная форма предназначена для создания транспортных заявок
          </Text>

          <Text>Отгрузки:</Text>

          <Text>
            Информацию точек отгрузки можно хранить в системе для того чтобы не
            заполнять их каждый раз. Таким образом при оформлении заявки можно
            будет выбрать точку отгрузки из списка. При необходимости можно
            будет добавить новую точку отгрузки.
          </Text>

          <Text>Любая отгрузка требует как минимум:</Text>

          <List>
            <List.Item>
              Информацию о местоположении куда везем (ширина и долгота адреса
              для составления маршрута)
            </List.Item>
            <List.Item>
              Что везем???? Характеристики посылки определяющие вес и остальные
              габариты??? (Для CVRP важен вес и количество груза - demand)
            </List.Item>
            <List.Item>
              CVRP - demand
              (https://developers.google.com/optimization/routing/cvrp)
            </List.Item>
            <List.Item>
              VRPTWs - временные окна у каждой точки
              (https://developers.google.com/optimization/routing/vrptw)
            </List.Item>
          </List>

          {fields}
          <Button
            onClick={() =>
              form.insertListItem("shipments", {
                location: null,
                key: randomId(),
                goods: [],
              })
            }
          >
            Добавить отгрузку
          </Button>

          <Text>Текущие значения формы:</Text>
          <Code block>{JSON.stringify(form.values, null, 2)}</Code>

          <Button type="submit" color="green">
            Отправить заявку
          </Button>
        </Stack>
      </form>
    </MantineProvider>
  );
}

import classes from './Errorable.module.css';

import { Container, Title, Group, Button, Text } from '@mantine/core';

import { useRouteError } from 'react-router-dom';

export const Errorable = () => {
  const error = useRouteError();

  console.error(error);

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Group justify="center">
            <Button size="md">Take me back to home page</Button>
          </Group>
        </div>
      </div>
    </Container>
  );
};

import { Box, Stack, Text } from '@mantine/core';
import { memo, useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

import API from '../../api/API';

type Route = {
  longitude: number | null;
  latitude: number | null;
}[];

export const Calculator = () => {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await API.get<Route[]>('/cvrp', {
          signal: controller.signal,
        });

        setRoutes(res.data);
      } catch (error) {
        if (!controller.signal?.aborted) {
          console.error(error);
        }
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Stack>
      {routes.map((locations, index) => (
        <Stack key={index}>
          <Text size="sm" fw="500">
            Маршрут {index + 1}
          </Text>
          <Box
            h={300}
            style={{
              borderRadius: '5px',
              overflow: 'hidden',
            }}
          >
            <MapContainer
              center={[
                Number(locations[0].latitude),
                Number(locations[0].longitude),
              ]}
              zoom={12}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locations
                .filter((location) => location.latitude && location.longitude)
                .map((location, index) => (
                  <Marker
                    key={index}
                    position={[
                      Number(location.latitude),
                      Number(location.longitude),
                    ]}
                  ></Marker>
                ))}
            </MapContainer>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
};

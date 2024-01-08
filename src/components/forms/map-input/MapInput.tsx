import { Box, Stack, TextInput } from '@mantine/core';
import { LatLngExpression } from 'leaflet';
import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';

const ClickMarker = ({
  coordinates,
  setCoordinates,
  isDeleteEnabled = true,
}: {
  coordinates: LatLngExpression | null;
  setCoordinates: (value: LatLngExpression | null) => void;
  isDeleteEnabled?: boolean;
}) => {
  const map = useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      // form.setFieldValue(`shipments.${shipmentIndex}.location`, [lat, lng]);
      setCoordinates([parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))]);
    },
  });

  return coordinates === null ? null : (
    <Marker position={coordinates}>
      {isDeleteEnabled && (
        <Popup>
          <span
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              event.nativeEvent.stopImmediatePropagation();
              setCoordinates(null);
            }}
          >
            Удалить ❌
          </span>
        </Popup>
      )}
    </Marker>
  );
};

export type MapInputPropsType = {
  state?: [LatLngExpression | null, (value: LatLngExpression | null) => void];
  isDeleteEnabled?: boolean;
};

export const MapInput = ({
  state,
  isDeleteEnabled = true,
}: MapInputPropsType) => {
  const [insideCoordinates, setInsideCoordinates] =
    useState<LatLngExpression | null>(null);

  const coordinates = state ? state[0] : insideCoordinates;
  const setCoordinates = state ? state[1] : setInsideCoordinates;

  return (
    <Stack>
      <TextInput
        label="Координаты"
        description="[latitude, longitude] или [широта, долгота]"
        value={coordinates ? JSON.stringify(coordinates) : ''}
        readOnly
        required={true}
      />
      <Box
        h={300}
        style={{
          borderRadius: '5px',
          overflow: 'hidden',
        }}
      >
        <MapContainer
          center={coordinates ? coordinates : [55.74, 37.62]}
          zoom={coordinates ? 16 : 10}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickMarker
            {...{
              coordinates,
              setCoordinates,
              isDeleteEnabled,
            }}
          />
        </MapContainer>
      </Box>
    </Stack>
  );
};

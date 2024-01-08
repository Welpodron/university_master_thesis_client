import { Box, Code, Text } from '@mantine/core';
import { LatLngExpression } from 'leaflet';
import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';

const ClickMarker = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  // const position = form.values.shipments[shipmentIndex].location;

  const map = useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      // form.setFieldValue(`shipments.${shipmentIndex}.location`, [lat, lng]);
      setPosition([lat, lng]);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        <span
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
            setPosition(null);
            // form.setFieldValue(`shipments.${shipmentIndex}.location`, null);
          }}
        >
          Удалить ❌
        </span>
      </Popup>
    </Marker>
  );
};

export const Map = () => {
  return (
    <Box
      h={300}
      style={{
        borderRadius: '5px',
        overflow: 'hidden',
      }}
    >
      <MapContainer center={[55.74, 37.62]} zoom={10}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickMarker />
      </MapContainer>
    </Box>
  );
};

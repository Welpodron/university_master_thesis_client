import { Box, Code, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { FormValuesType } from "../../App";

export type ClickMarkerPropsType = {
  form: UseFormReturnType<FormValuesType>;
  shipmentIndex: number;
};

const ClickMarker = ({ form, shipmentIndex }: ClickMarkerPropsType) => {
  const position = form.values.shipments[shipmentIndex].location;

  const map = useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      form.setFieldValue(`shipments.${shipmentIndex}.location`, [lat, lng]);
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
            form.setFieldValue(`shipments.${shipmentIndex}.location`, null);
          }}
        >
          Удалить ❌
        </span>
      </Popup>
    </Marker>
  );
};

export type MapPropsType = {
  form: UseFormReturnType<FormValuesType>;
  shipmentIndex: number;
};

export const Map = ({ form, shipmentIndex }: MapPropsType) => {
  return (
    <Box h={300}>
      <MapContainer center={[55.74, 37.62]} zoom={10}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickMarker {...{ form, shipmentIndex }} />
      </MapContainer>
    </Box>
  );
};

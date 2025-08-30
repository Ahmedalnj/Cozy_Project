"use client";

import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
// @ts-expect-error: _getIconUrl is a private property not exposed in types, but we need to override it for custom marker icons

// إعداد أيقونة Marker مخصصة
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  center?: [number, number];
  locationLabel?: string;
}

// لإعادة تركيز الخريطة عند تغيير المركز
const Recenter: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center as L.LatLngTuple);
  }, [center, map]);
  return null;
};

const Map: React.FC<MapProps> = ({ center, locationLabel }) => {
  return (
    <div className="relative w-full h-[450px] md:h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        center={(center as L.LatLngExpression) || [51, -0.09]}
        zoom={center ? 8 : 2}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{
          filter: "grayscale(10%) contrast(105%)",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {center && (
          <>
            <Marker position={center as L.LatLngTuple} />
            <Recenter center={center as [number, number]} />
          </>
        )}
      </MapContainer>

      {/* Overlay معلومات الموقع */}
      {locationLabel && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-lg font-semibold text-neutral-800">
            Where you'll be
          </h2>
          <p className="text-neutral-600 mt-1">{locationLabel}</p>
        </div>
      )}
    </div>
  );
};

export default Map;

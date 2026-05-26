import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

const placeMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationPicker({ markerPosition, onPick }) {
  useMapEvents({
    click(event) {
      onPick({
        lat: Number(event.latlng.lat.toFixed(6)),
        lng: Number(event.latlng.lng.toFixed(6))
      });
    }
  });

  if (!markerPosition) {
    return null;
  }

  return <Marker position={[markerPosition.lat, markerPosition.lng]} icon={placeMarkerIcon} />;
}

export function PlaceLocationPickerMap({ mapKey, markerPosition, onPick, className = "h-[420px] w-full" }) {
  return (
    <MapContainer key={mapKey} center={[markerPosition.lat, markerPosition.lng]} zoom={11} scrollWheelZoom className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationPicker markerPosition={markerPosition} onPick={onPick} />
    </MapContainer>
  );
}

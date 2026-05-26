import { useState } from "react";
import { defaultMapCenter } from "../lib/submitPlaceForm";

export function usePlaceLocationState(setValue) {
  const [markerPosition, setMarkerPosition] = useState({
    lat: defaultMapCenter[0],
    lng: defaultMapCenter[1]
  });
  const [resetLocationTarget, setResetLocationTarget] = useState({
    lat: defaultMapCenter[0],
    lng: defaultMapCenter[1]
  });

  function syncLocation({ lat, lng }) {
    setMarkerPosition({ lat, lng });
    setValue("latitude", lat, { shouldDirty: true });
    setValue("longitude", lng, { shouldDirty: true });
  }

  function hydrateLocation({ lat, lng }) {
    setMarkerPosition({ lat, lng });
    setResetLocationTarget({ lat, lng });
  }

  function resetLocation() {
    setMarkerPosition(resetLocationTarget);
    setValue("latitude", resetLocationTarget.lat, { shouldDirty: true });
    setValue("longitude", resetLocationTarget.lng, { shouldDirty: true });
  }

  function resetLocationState() {
    const [lat, lng] = defaultMapCenter;
    setMarkerPosition({ lat, lng });
    setResetLocationTarget({ lat, lng });
  }

  return {
    markerPosition,
    resetLocationTarget,
    syncLocation,
    hydrateLocation,
    resetLocation,
    resetLocationState
  };
}

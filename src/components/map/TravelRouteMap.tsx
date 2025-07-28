import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
  InfoWindow,
} from "@react-google-maps/api";

export type Spot = {
  lat: number;
  lng: number;
  name: string;
  description?: string;
  images?: string[];
  order?: number;
};

type TravelRouteMapProps = {
  spots: Spot[];
};

const containerStyle = { width: "100%", height: "400px" };

export const TravelRouteMap: React.FC<TravelRouteMapProps> = ({ spots }) => {
  // モック地図切り替え
  const useMockMap = import.meta.env.VITE_USE_MOCK_MAP === "true";
  const [selected, setSelected] = useState<Spot | null>(null);

  if (useMockMap) {
    return (
      <div
        style={{
          ...containerStyle,
          background: "#e5e7eb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
          fontSize: 20,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      >
        <span style={{ marginBottom: 16 }}>
          モック地図（Google Maps APIは呼び出されません）
        </span>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          {spots.map((spot, idx) => (
            <button
              key={idx}
              style={{
                padding: "8px 12px",
                borderRadius: 4,
                background: selected === spot ? "#bae6fd" : "#fff",
                border: "1px solid #bbb",
                cursor: "pointer",
                fontSize: 14,
              }}
              onClick={() => setSelected(spot)}
            >
              {`${idx + 1}. ${spot.name}`}
            </button>
          ))}
        </div>
        {selected && (
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 16,
              minWidth: 200,
              boxShadow: "0 2px 8px #0001",
            }}
          >
            <h3 style={{ fontWeight: "bold", marginBottom: 8 }}>
              {selected.name}
            </h3>
            {selected.description && (
              <p style={{ marginBottom: 8 }}>{selected.description}</p>
            )}
            {selected.images && selected.images.length > 0 && (
              <img
                src={selected.images[0]}
                alt={selected.name}
                style={{ width: "100px" }}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  // Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!isLoaded || spots.length < 2) return;
    const waypoints = spots.slice(1, -1).map((s) => ({
      location: { lat: s.lat, lng: s.lng },
      stopover: true,
    }));
    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: { lat: spots[0].lat, lng: spots[0].lng },
        destination: {
          lat: spots[spots.length - 1].lat,
          lng: spots[spots.length - 1].lng,
        },
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) setDirections(result);
      }
    );
  }, [isLoaded, spots]);

  if (!isLoaded) return <div>地図を読み込み中...</div>;
  if (!spots.length) return <div>スポット情報がありません</div>;

  const center = { lat: spots[0].lat, lng: spots[0].lng };

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
      {spots.map((spot, idx) => (
        <Marker
          key={idx}
          position={{ lat: spot.lat, lng: spot.lng }}
          label={`${idx + 1}`}
          onClick={() => setSelected(spot)}
        />
      ))}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{ suppressMarkers: true }}
        />
      )}
      {selected && (
        <InfoWindow
          position={{ lat: selected.lat, lng: selected.lng }}
          onCloseClick={() => setSelected(null)}
        >
          <div>
            <h3 className="font-bold">{selected.name}</h3>
            {selected.description && <p>{selected.description}</p>}
            {selected.images && selected.images.length > 0 && (
              <img
                src={selected.images[0]}
                alt={selected.name}
                style={{ width: "100px" }}
              />
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

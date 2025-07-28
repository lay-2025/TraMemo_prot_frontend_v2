import React, { useCallback, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";

// 都道府県・国名→緯度経度変換用の簡易マップ（必要に応じて拡張）
const PREFECTURE_CENTER: Record<string, { lat: number; lng: number }> = {
  東京都: { lat: 35.6895, lng: 139.6917 },
  大阪府: { lat: 34.6937, lng: 135.5023 },
  北海道: { lat: 43.0642, lng: 141.3469 },
  // ...他都道府県も追加可
};
const COUNTRY_CENTER: Record<string, { lat: number; lng: number }> = {
  日本: { lat: 36.2048, lng: 138.2529 },
  アメリカ: { lat: 37.0902, lng: -95.7129 },
  フランス: { lat: 46.6034, lng: 1.8883 },
  // ...他国も追加可
};

interface MapComponentProps {
  initialPrefecture?: string;
  initialCountry?: string;
  initialLatLng?: { lat: number; lng: number };
  markerLatLng?: { lat: number; lng: number };
  onMarkerChange?: (lat: number, lng: number) => void;
  enableSearch?: boolean;
  onClose?: () => void;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

export const MapComponent: React.FC<MapComponentProps> = ({
  initialPrefecture,
  initialCountry,
  initialLatLng,
  markerLatLng,
  onMarkerChange,
  enableSearch = true,
  onClose,
}) => {
  // モック地図切り替え
  const useMockMap = import.meta.env.VITE_USE_MOCK_MAP === "true";
  if (useMockMap) {
    // 有名観光地リスト
    const famousSpots = [
      { name: "東京タワー（日本）", lat: 35.6586, lng: 139.7454 },
      { name: "京都・清水寺（日本）", lat: 34.9948, lng: 135.785 },
      { name: "札幌・大通公園（日本）", lat: 43.0606, lng: 141.34 },
      { name: "沖縄・首里城（日本）", lat: 26.2173, lng: 127.719 },
      { name: "パリ・エッフェル塔（フランス）", lat: 48.8584, lng: 2.2945 },
      {
        name: "ニューヨーク・自由の女神（アメリカ）",
        lat: 40.6892,
        lng: -74.0445,
      },
      { name: "ロンドン・ビッグベン（イギリス）", lat: 51.5007, lng: -0.1246 },
      {
        name: "シドニー・オペラハウス（オーストラリア）",
        lat: -33.8568,
        lng: 151.2153,
      },
      { name: "北京・天安門広場（中国）", lat: 39.9087, lng: 116.3975 },
      {
        name: "リオ・コルコバードのキリスト像（ブラジル）",
        lat: -22.9519,
        lng: -43.2105,
      },
    ];
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
          {famousSpots.map((spot) => (
            <button
              key={spot.name}
              style={{
                padding: "8px 12px",
                borderRadius: 4,
                background: "#fff",
                border: "1px solid #bbb",
                cursor: "pointer",
                fontSize: 14,
              }}
              onClick={() =>
                onMarkerChange && onMarkerChange(spot.lat, spot.lng)
              }
            >
              {spot.name}
            </button>
          ))}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              padding: "4px 12px",
              borderRadius: 4,
              background: "#eee",
              border: "none",
              cursor: "pointer",
            }}
          >
            閉じる
          </button>
        )}
      </div>
    );
  }

  const [center, setCenter] = useState<{ lat: number; lng: number }>(() => {
    if (initialLatLng) return initialLatLng;
    if (initialPrefecture && PREFECTURE_CENTER[initialPrefecture])
      return PREFECTURE_CENTER[initialPrefecture];
    if (initialCountry && COUNTRY_CENTER[initialCountry])
      return COUNTRY_CENTER[initialCountry];
    return { lat: 35.6895, lng: 139.6917 }; // デフォルト:東京
  });
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    markerLatLng || null
  );
  const [searchBox, setSearchBox] = useState<any>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarker({ lat, lng });
        onMarkerChange && onMarkerChange(lat, lng);
      }
    },
    [onMarkerChange]
  );

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const loc = places[0].geometry?.location;
        if (loc) {
          const lat = loc.lat();
          const lng = loc.lng();
          setCenter({ lat, lng });
        }
      }
    }
  };

  if (!isLoaded) return <div>地図を読み込み中...</div>;

  return (
    <div>
      {enableSearch && (
        <StandaloneSearchBox
          onLoad={setSearchBox}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="場所を検索"
            style={{
              boxSizing: "border-box",
              border: "1px solid #ccc",
              width: "100%",
              height: "40px",
              marginBottom: 8,
              padding: 8,
              borderRadius: 4,
            }}
          />
        </StandaloneSearchBox>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={onMapClick}
      >
        {marker && (
          <Marker position={marker} draggable onDragEnd={onMapClick} />
        )}
      </GoogleMap>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginTop: 8,
            padding: "8px 16px",
            borderRadius: 4,
            background: "#eee",
          }}
        >
          閉じる
        </button>
      )}
    </div>
  );
};

export default MapComponent;

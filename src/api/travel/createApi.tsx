import { format } from "date-fns";
import {
  type LocationCategory,
  type Visibility,
  type PrefectureId,
  type CountryId,
} from "@/constants/location";

export function formatDate(date: Date | null) {
  return date ? format(date, "yyyy-MM-dd") : null;
}

export interface TravelLocation {
  id: string;
  order: number;
  name: string;
  lat: number | undefined;
  lng: number | undefined;
  description: string;
  visitDate: Date | null;
  visitTime: string | null;
}

export type TravelFormData = {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  visibility: Visibility;
  locationCategory: LocationCategory;
  prefecture?: PrefectureId;
  country?: CountryId;
};

export async function createTravel(
  token: string | null,
  formData: TravelFormData,
  locations: TravelLocation[],
  tags: string[],
  selectedImages: File[],
  _isDraft: boolean
) {
  const payload = {
    title: formData.title,
    description: formData.description || "",
    startDate: formatDate(formData.startDate),
    endDate: formatDate(formData.endDate),
    visibility: formData.visibility,
    locationCategory: formData.locationCategory,
    prefecture: formData.prefecture || null,
    country: formData.country || null,
    locations: locations.map((loc, idx) => ({
      order: typeof loc.order === "number" ? loc.order : idx + 1,
      name: loc.name,
      lat: loc.lat || null,
      lng: loc.lng || null,
      description: loc.description || "",
      visitDate: formatDate(loc.visitDate),
      visitTime: loc.visitTime || null,
    })),
    tags: tags || [],
    images: selectedImages.map((file) => file.name), // 実際はアップロード処理が必要
  };

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/travels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "投稿に失敗しました");
  }

  // デバッグ用のログ出力
  console.log("投稿完了", payload);

  return await response.json();
}


export interface TravelItineraryActivity {
  time?: string;
  name: string;
  description?: string;
}

export interface TravelItineraryDay {
  day: number;
  date?: string;
  activities: TravelItineraryActivity[];
}

export interface TravelLocationDetail {
  name: string;
  lat: number;
  lng: number;
  description: string;
  orderIndex?: number;
}

export interface TravelDetail {
  id: number;
  title: string;
  location: string;
  date: string;
  duration: string;
  images: string[];
  description: string;
  user: {
    name: string;
    avatar: string;
    bio?: string;
  };
  likes: number;
  commentCount: number;
  tags: string[];
  locations: TravelLocationDetail[];
  itinerary: TravelItineraryDay[];
  comments?: Array<{
    id: number;
    user: { name: string; avatar: string };
    content: string;
    date: string;
  }>;
}

export async function getTravelDetail(id: string | number): Promise<TravelDetail> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/travels/${id}`);
  if (!res.ok) throw new Error("旅行記録の取得に失敗しました");
  const data = await res.json();
  return data.data as TravelDetail;
} 
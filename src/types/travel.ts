import { LocationCategory, Visibility, PrefectureId, CountryId } from "@/constants/location";

// 旅行記録一覧アイテムの型定義
export interface TravelListItem {
  id: number;
  title: string;
  location: string;
  date: string;
  duration: string;
  images: string[];
  description: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  likes: number;
  commentCount: number;
  tags: string[];
  locationCategory: LocationCategory;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
}

// 検索・フィルタパラメータの型定義
export interface TravelSearchFilterParams {
  query?: string;
  locationCategory?: LocationCategory;
  prefecture?: PrefectureId;
  country?: CountryId;
  visibility?: Visibility;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  minLikes?: number;
  minComments?: number;
  sortBy?: 'created_at' | 'likes' | 'title' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// APIレスポンスの型定義
export interface TravelListResponse {
  data: TravelListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// 表示モードの型定義
export type ViewMode = 'grid' | 'list';

// ソートオプションの型定義
export interface SortOption {
  value: string;
  label: string;
}

// フィルタオプションの型定義
export interface FilterOption {
  value: string | number;
  label: string;
} 
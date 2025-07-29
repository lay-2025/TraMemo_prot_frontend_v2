"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getTravelList, TravelListResponse } from "@/api/travel/getListApi";
import {
  TravelListItem,
  TravelSearchFilterParams,
  ViewMode,
} from "@/types/travel";
import { LOCATION_CATEGORIES, LOCATION_CATEGORY } from "@/constants/location";

// デフォルト値の統一
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

export default function TravelListPage() {
  // 状態管理
  const [travels, setTravels] = useState<TravelListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 検索・フィルタ条件（UI用）
  const [searchForm, setSearchForm] = useState({
    query: "",
    locationCategory: "all" as string,
    sortBy: "created_at" as string,
    sortOrder: "desc" as "asc" | "desc",
    limit: DEFAULT_LIMIT,
  });

  // 実際のAPIリクエスト用パラメータ
  const [searchParams, setSearchParams] = useState<TravelSearchFilterParams>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [meta, setMeta] = useState<TravelListResponse["meta"] | null>(null);

  // データ取得
  const fetchTravels = async (params: TravelSearchFilterParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTravelList(params);
      setTravels(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "データの取得に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  };

  // 初期データ取得
  useEffect(() => {
    fetchTravels(searchParams);
  }, [searchParams]);

  // 検索・フィルタ処理（UI用）
  const handleSearchInput = (query: string) => {
    setSearchForm((prev) => ({ ...prev, query }));
  };

  const handleLocationCategoryChange = (category: string) => {
    setSearchForm((prev) => ({ ...prev, locationCategory: category }));
  };

  const handleSortChange = (sortBy: string) => {
    setSearchForm((prev) => ({ ...prev, sortBy }));
  };

  const handleSortOrderChange = (order: string) => {
    setSearchForm((prev) => ({ ...prev, sortOrder: order as "asc" | "desc" }));
  };

  const handleLimitChange = (limit: string) => {
    setSearchForm((prev) => ({ ...prev, limit: parseInt(limit) }));
  };

  // 検索実行ボタン
  const handleSearchExecute = () => {
    const newSearchParams: TravelSearchFilterParams = {
      page: DEFAULT_PAGE,
      limit: searchForm.limit,
      sortBy: searchForm.sortBy as any,
      sortOrder: searchForm.sortOrder,
    };

    // 検索クエリがある場合
    if (searchForm.query.trim()) {
      newSearchParams.query = searchForm.query.trim();
    }

    // 場所カテゴリが選択されている場合
    if (searchForm.locationCategory !== "all") {
      newSearchParams.locationCategory = parseInt(
        searchForm.locationCategory
      ) as any;
    }

    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => ({ ...prev, page }));
  };

  // ローディング表示
  if (loading && travels.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchTravels(searchParams)}>再試行</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">旅行記録</h1>
        <p className="text-muted-foreground">
          素晴らしい旅行の思い出を発見しましょう
        </p>
      </div>

      {/* 検索・フィルタバー */}
      <div className="mb-6 space-y-4">
        {/* 検索バー */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="旅行先、ユーザー、タグを検索..."
              className="pl-10"
              value={searchForm.query}
              onChange={(e) => handleSearchInput(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            フィルタ
          </Button>
          <Button
            onClick={handleSearchExecute}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            検索
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* フィルタパネル */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    場所カテゴリ
                  </label>
                  <Select
                    value={searchForm.locationCategory}
                    onValueChange={handleLocationCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value={LOCATION_CATEGORY.DOMESTIC.toString()}>
                        {LOCATION_CATEGORIES[LOCATION_CATEGORY.DOMESTIC]}
                      </SelectItem>
                      <SelectItem value={LOCATION_CATEGORY.OVERSEAS.toString()}>
                        {LOCATION_CATEGORIES[LOCATION_CATEGORY.OVERSEAS]}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    並び順
                  </label>
                  <Select
                    value={searchForm.sortBy}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">作成日時</SelectItem>
                      <SelectItem value="likes">いいね数</SelectItem>
                      <SelectItem value="title">タイトル</SelectItem>
                      <SelectItem value="date">旅行日</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">順序</label>
                  <Select
                    value={searchForm.sortOrder}
                    onValueChange={handleSortOrderChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">新しい順</SelectItem>
                      <SelectItem value="asc">古い順</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    表示件数
                  </label>
                  <Select
                    value={searchForm.limit.toString()}
                    onValueChange={handleLimitChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6件</SelectItem>
                      <SelectItem value="12">12件</SelectItem>
                      <SelectItem value="24">24件</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 結果件数 */}
      {meta && (
        <div className="mb-4 text-sm text-muted-foreground">
          {meta.total}件の旅行記録が見つかりました
        </div>
      )}

      {/* 旅行記録一覧 */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {travels.map((travel) => (
            <TravelCard key={travel.id} travel={travel} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {travels.map((travel) => (
            <TravelCardList key={travel.id} travel={travel} />
          ))}
        </div>
      )}

      {/* ページネーション */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={meta.current_page === 1}
              onClick={() => handlePageChange(meta.current_page - 1)}
            >
              前へ
            </Button>

            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={page === meta.current_page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              disabled={meta.current_page === meta.last_page}
              onClick={() => handlePageChange(meta.current_page + 1)}
            >
              次へ
            </Button>
          </div>
        </div>
      )}

      {/* データがない場合 */}
      {travels.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">旅行記録が見つかりません</p>
            <p className="text-sm">検索条件を変更してみてください</p>
          </div>
        </div>
      )}
    </div>
  );
}

// グリッド表示用のカードコンポーネント
function TravelCard({ travel }: { travel: TravelListItem }) {
  return (
    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
      <Link to={`/travels/${travel.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={travel.images[0] || "/placeholder.svg"}
            alt={travel.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {LOCATION_CATEGORIES[travel.locationCategory]}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/travels/${travel.id}`} className="hover:underline flex-1">
            <h3 className="font-semibold text-lg line-clamp-2">
              {travel.title}
            </h3>
          </Link>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{travel.location}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          <span>{travel.date}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {travel.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {travel.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {travel.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{travel.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={travel.user.avatar} />
              <AvatarFallback>{travel.user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {travel.user.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{travel.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{travel.commentCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// リスト表示用のカードコンポーネント
function TravelCardList({ travel }: { travel: TravelListItem }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        <Link to={`/travels/${travel.id}`} className="flex-shrink-0">
          <div className="relative w-32 h-24 overflow-hidden">
            <img
              src={travel.images[0] || "/placeholder.svg"}
              alt={travel.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        <CardContent className="p-4 flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <Link to={`/travels/${travel.id}`} className="hover:underline">
                <h3 className="font-semibold text-lg">{travel.title}</h3>
              </Link>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{travel.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{travel.date}</span>
                </div>
              </div>
            </div>

            <Badge variant="secondary" className="text-xs">
              {LOCATION_CATEGORIES[travel.locationCategory]}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {travel.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={travel.user.avatar} />
                <AvatarFallback>{travel.user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {travel.user.name}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5" />
                <span>{travel.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{travel.commentCount}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {travel.tags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {travel.tags.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{travel.tags.length - 5}
              </Badge>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

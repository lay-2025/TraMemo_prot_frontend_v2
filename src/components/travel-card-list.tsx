"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TravelCard } from "./travel-card";
import { Link } from "react-router-dom";
import { getTravelList } from "@/api/travel/getListApi";
import { TravelListItem } from "@/types/travel";

// モックデータ
const TRAVEL_DATA = [
  {
    id: 1,
    title: "京都の古都を巡る旅",
    location: "京都府, 日本",
    date: "2023年10月15日 - 2023年10月20日",
    images: ["/placeholder.svg?height=300&width=400"],
    description:
      "京都の伝統的な寺院や庭園を訪れ、日本の歴史と文化に触れる旅。金閣寺、清水寺、伏見稲荷大社など多くの名所を巡りました。",
    user: {
      name: "田中太郎",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 124,
    comments: 18,
    tags: ["京都", "寺院", "日本文化", "紅葉"],
  },
  {
    id: 2,
    title: "バリ島でのリラックス休暇",
    location: "バリ島, インドネシア",
    date: "2023年8月5日 - 2023年8月15日",
    images: ["/placeholder.svg?height=300&width=400"],
    description:
      "バリ島の美しいビーチでリラックスし、地元の文化や料理を楽しんだ10日間。ウブドの棚田やウルワツ寺院も訪れました。",
    user: {
      name: "佐藤花子",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 98,
    comments: 12,
    tags: ["バリ島", "ビーチ", "リゾート", "南国"],
  },
  {
    id: 3,
    title: "パリの芸術と食を堪能する旅",
    location: "パリ, フランス",
    date: "2023年6月10日 - 2023年6月17日",
    images: ["/placeholder.svg?height=300&width=400"],
    description:
      "ルーブル美術館やオルセー美術館で芸術作品を鑑賞し、パリの美味しいレストランやカフェでフランス料理を堪能しました。",
    user: {
      name: "鈴木一郎",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 156,
    comments: 24,
    tags: ["パリ", "美術館", "フランス料理", "ヨーロッパ"],
  },
  {
    id: 4,
    title: "ニューヨーク市街地探索",
    location: "ニューヨーク, アメリカ",
    date: "2023年4月20日 - 2023年4月27日",
    images: ["/placeholder.svg?height=300&width=400"],
    description:
      "マンハッタンの摩天楼、セントラルパーク、ブロードウェイのショーなど、ニューヨークの魅力を存分に味わいました。",
    user: {
      name: "山田健太",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 87,
    comments: 9,
    tags: ["ニューヨーク", "都市", "アメリカ", "観光"],
  },
];

export function TravelCardList() {
  const [travels, setTravels] = useState<TravelListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // APIから最新4件を取得
  useEffect(() => {
    const fetchLatestTravels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getTravelList({
          limit: 4,
          sortBy: "created_at",
          sortOrder: "desc",
          visibility: 1, // 公開のみ
        });
        setTravels(response.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "最新の旅行記録の取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTravels();
  }, []);

  // ローディング表示
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  // エラー表示
  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  // データが空の場合
  if (travels.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        まだ旅行記録がありません。
      </div>
    );
  }

  return (
    <div>
      {/* 最新4件の旅行記録を表示 */}
      {/* TODO: キャッシュ利用なども考慮しUIなどは検討　人気の旅行記録　かつ　国内・海外を選択？ */}
      {/* 
      <Tabs
        defaultValue="all"
        value={tab}
        onValueChange={setTab}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="domestic">国内</TabsTrigger>
          <TabsTrigger value="overseas">海外</TabsTrigger>
        </TabsList>
      </Tabs>
      */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {travels.map((travel) => (
          <TravelCard
            key={travel.id}
            travel={{
              id: travel.id,
              title: travel.title,
              location: travel.location,
              date: travel.date,
              images: travel.images,
              description: travel.description,
              user: {
                name: travel.user.name,
                avatar: travel.user.avatar,
              },
              likes: travel.likes,
              comments: travel.commentCount, // commentCount を comments にマッピング
              tags: travel.tags,
            }}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button asChild>
          <Link to="/travels">もっと見る</Link>
        </Button>
      </div>
    </div>
  );
}

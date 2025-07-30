"use client";

import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Share2,
  Bookmark,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getTravelDetail, TravelDetail } from "@/api/travel/getDetailApi";
import { TravelRouteMap } from "@/components/map/TravelRouteMap";

export default function TravelDetailPage() {
  const { id } = useParams();
  const [travelData, setTravelData] = useState<TravelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getTravelDetail(id)
      .then((data) => setTravelData(data))
      .catch((e) => {
        setTravelData(null);
        setError(e.message || "データ取得に失敗しました");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;
  if (!travelData) return <div>データが見つかりません</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{travelData.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {travelData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-teal-600" />
              <span>{travelData.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-600" />
              <span>{travelData.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-600" />
              <span>{travelData.duration}</span>
            </div>
          </div>

          {/* 画像ギャラリー */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="md:col-span-2">
              <img
                src={travelData.images[0] || "/placeholder.svg"}
                alt={travelData.title}
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            {travelData.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${travelData.title} ${index + 2}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* タブコンテンツ */}
          <Tabs defaultValue="description" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">詳細</TabsTrigger>
              <TabsTrigger value="itinerary">旅程</TabsTrigger>
              <TabsTrigger value="map">地図</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-line">
                    {travelData.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 旅程タブ */}
            {/* ここではタイトルの下に説明・感想の出力欄を追加 */}
            <TabsContent value="itinerary" className="mt-4">
              <div className="space-y-6">
                {(travelData.itinerary ?? []).map((day) => (
                  <Card key={day.day} className="p-4">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-lg font-bold text-blue-700">
                        Day {day.day}
                      </span>
                      {day.date && (
                        <span className="text-md text-gray-600">
                          {day.date}
                        </span>
                      )}
                    </div>
                    <div className="pl-4 border-l-2 border-blue-200 space-y-4">
                      {(day.activities ?? []).map((activity, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 relative"
                        >
                          <div className="flex flex-col items-center min-w-[60px]">
                            <span className="text-lg font-bold text-blue-700">
                              {activity.time
                                ? activity.time.slice(0, 5)
                                : "--:--"}
                            </span>
                            {idx < (day.activities?.length ?? 0) - 1 && (
                              <span className="block w-px h-6 bg-blue-200 mx-auto"></span>
                            )}
                          </div>
                          <div className="flex-1">
                            <span className="block text-base font-semibold">
                              {activity.name}
                            </span>
                            {activity.description && (
                              <span className="block text-sm text-gray-500 mt-1">
                                {activity.description}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="map" className="mt-4">
              <TravelRouteMap
                spots={travelData.locations.map((loc) => ({
                  lat: loc.lat,
                  lng: loc.lng,
                  name: loc.name,
                  description: loc.description,
                  // images: ... // 紐づく画像があればここに
                }))}
              />
            </TabsContent>
          </Tabs>

          {/* コメントセクション */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              コメント ({travelData.comments?.length || 0})
            </h2>

            {/* コメント一覧 */}
            {travelData.comments && travelData.comments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">コメント</h2>
                <div className="space-y-4">
                  {travelData.comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="flex items-start gap-4 p-4">
                        <Avatar>
                          <AvatarImage src={comment.user.avatar} />
                          <AvatarFallback>
                            {comment.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{comment.user.name}</div>
                          <div className="text-sm text-muted-foreground mb-1">
                            {comment.date}
                          </div>
                          <div>{comment.content}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>ユ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  className="w-full p-3 border rounded-lg resize-none min-h-[100px]"
                  placeholder="コメントを追加..."
                />
                <div className="flex justify-end mt-2">
                  <Button>投稿する</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* サイドバー */}
        <div>
          {/* ユーザー情報 */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={travelData.user.avatar || "/placeholder.svg"}
                    alt={travelData.user.name}
                  />
                  <AvatarFallback>{travelData.user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    to={`/users/${travelData.user.name}`}
                    className="font-medium hover:underline"
                  >
                    {travelData.user.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">投稿者</p>
                </div>
              </div>
              <p className="text-sm mb-4">{travelData.user.bio}</p>
              <Button variant="outline" className="w-full">
                フォローする
              </Button>
            </CardContent>
          </Card>

          {/* アクションボタン */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>いいね ({travelData.likes})</span>
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>保存</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 col-span-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>シェア</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 訪問地リスト */}
          {/* <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">訪問地</h3>
              {travelData.locations.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {travelData.locations.map((location, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{location.name}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          {location.description || "説明はありません。"}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  訪問地の情報はありません。
                </p>
              )}
            </CardContent>
          </Card> */}

          {/* TODO: AIによるPickUp情報（プレースホルダー） */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold">AIによる旅行先のおすすめ情報</h3>
                <Badge variant="secondary" className="text-xs">
                  近日公開
                </Badge>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                  <h4 className="font-medium text-purple-800 mb-2">
                    ✨ この旅行記録から抽出された情報
                  </h4>
                  <p className="text-sm text-purple-700">
                    旅行記録の内容に基づいて、関連する観光スポットの情報やトリビア、おすすめのアクティビティなどがここに表示される予定です。
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-800 mb-2">
                    🎯 パーソナライズされたおすすめ
                  </h4>
                  <p className="text-sm text-green-700">
                    あなたの旅行スタイルや好みに合わせて、次回の旅行プランや関連する旅行記録をおすすめします。
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
                  <h4 className="font-medium text-orange-800 mb-2">
                    💡 旅行の豆知識
                  </h4>
                  <p className="text-sm text-orange-700">
                    訪問地に関する歴史的な背景や、現地の人々の生活文化など、より深い理解を提供します。
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-muted-foreground text-center">
                  AI機能は現在開発中です。より豊かな旅行体験を提供するため、鋭意開発を進めています。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

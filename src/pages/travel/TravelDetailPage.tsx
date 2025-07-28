"use client";

import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Share2, Bookmark, MapPin, Calendar, Clock } from "lucide-react";
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
          {/* この部分をAIによるPickUp情報の表示場所に使ってもよいかも */}
          {/* 投稿を読んで、金閣寺に訪問しているなら金閣寺についての説明やトリビアなどを表示するようなイメージ */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">訪問地</h3>
              <ul className="space-y-3">
                {travelData.locations.map((location, index) => (
                  <li
                    key={index}
                    className="border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="font-medium">{location.name}</div>
                    <p className="text-sm text-muted-foreground">
                      {location.description}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

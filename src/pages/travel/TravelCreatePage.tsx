"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  CalendarIcon,
  Upload,
  X,
  Plus,
  Save,
  Eye,
  Globe,
  Lock,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { createTravel } from "@/api/travel/createApi";
import { useAuth } from "@clerk/clerk-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MapComponent from "@/components/map-component";
import {
  LOCATION_CATEGORY,
  VISIBILITY,
  PREFECTURES,
  COUNTRIES,
  getPrefectureNameForMap,
  getCountryNameForMap,
  type LocationCategory,
  type Visibility,
  type PrefectureId,
  type CountryId,
} from "@/constants/location";
import { toast } from "sonner";

interface FormDataType {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  visibility: Visibility;
  locationCategory: LocationCategory;
  prefecture?: PrefectureId;
  country?: CountryId;
}

interface TravelLocation {
  id: string;
  order: number;
  name: string;
  lat: number | undefined;
  lng: number | undefined;
  description: string;
  visitDate: Date | null;
  visitTime: string | null;
}

// 必須項目のバリデーション関数
function validateForm(formData: FormDataType, locations: TravelLocation[]) {
  const errors: Record<string, string> = {};
  if (!formData.title || formData.title.trim() === "")
    errors.title = "タイトルは必須です";
  if (!formData.startDate) errors.startDate = "開始日は必須です";
  if (!formData.endDate) errors.endDate = "終了日は必須です";
  if (formData.visibility === undefined)
    errors.visibility = "公開設定は必須です";
  if (
    formData.locationCategory === LOCATION_CATEGORY.DOMESTIC &&
    !formData.prefecture
  )
    errors.prefecture = "都道府県は必須です";
  if (
    formData.locationCategory === LOCATION_CATEGORY.OVERSEAS &&
    !formData.country
  )
    errors.country = "国名は必須です";
  if (!locations.length) errors.locations = "訪問地を1件以上追加してください";
  locations.forEach((loc: TravelLocation, i: number) => {
    if (!loc.name || loc.name.trim() === "")
      errors[`location_name_${i}`] = `訪問地${i + 1}の場所名は必須です`;
    if (!loc.visitDate)
      errors[`location_visitDate_${i}`] = `訪問地${i + 1}の訪問日は必須です`;
    if (!loc.order)
      errors[`location_order_${i}`] = `訪問地${i + 1}の順番は必須です`;
  });
  return errors;
}

export default function CreateTravelPage() {
  // Clerkの認証トークンを取得するフックを使用
  const { getToken } = useAuth();

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    visibility: VISIBILITY.PUBLIC,
    locationCategory: LOCATION_CATEGORY.DOMESTIC,
    prefecture: undefined,
    country: undefined,
  });

  const [locations, setLocations] = useState<TravelLocation[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapOpenIndex, setMapOpenIndex] = useState<string | null>(null);
  const [tempLatLng, setTempLatLng] = useState<{
    [id: string]: { lat: number; lng: number } | null;
  }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleAddLocation = () => {
    const newLocation: TravelLocation = {
      id: Date.now().toString(),
      order: locations.length + 1,
      name: "",
      lat: undefined,
      lng: undefined,
      description: "",
      visitDate: null,
      visitTime: null,
    };
    setLocations([...locations, newLocation]);
  };

  const handleUpdateLocation = (
    id: string,
    updates: Partial<TravelLocation>
  ) => {
    setLocations(
      locations.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc))
    );
  };

  const handleRemoveLocation = (id: string) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (isDraft = false) => {
    setIsSubmitting(true);
    const errors = validateForm(formData, locations);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    // clerkの認証トークンを取得
    const token = await getToken();

    try {
      await createTravel(
        token,
        formData,
        locations,
        tags,
        selectedImages,
        isDraft
      );

      // 成功時の処理
      setIsSubmitting(false);
      toast.success("投稿が完了しました");
      // 必要ならリダイレクトや通知
    } catch (error) {
      setIsSubmitting(false);
      console.error(error);
      toast.error("投稿に失敗しました", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">新しい旅行記録を作成</h1>
          <div className="flex gap-2">
            {/* TODO:下書き保存機能は一旦保留 */}
            {/* 下書き保存するならば、下書き保存フラグのカラム追加と編集機能があればいけるか？ */}
            {/* <Button variant="outline" onClick={() => handleSubmit(true)}>
              <Save className="h-4 w-4 mr-2" />
              下書き保存
            </Button> */}
            <Button
              onClick={() => handleSubmit(false)}
              disabled={
                isSubmitting ||
                Object.keys(validateForm(formData, locations)).length > 0
              }
            >
              {isSubmitting ? (
                "投稿中..."
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  投稿
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインフォーム */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本情報 */}
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 場所カテゴリ */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    場所カテゴリ
                  </label>
                  <Select
                    value={formData.locationCategory.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        locationCategory: Number(value) as LocationCategory,
                        // カテゴリ変更時に都道府県・国名をリセット
                        prefecture: undefined,
                        country: undefined,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={LOCATION_CATEGORY.DOMESTIC.toString()}>
                        国内
                      </SelectItem>
                      <SelectItem value={LOCATION_CATEGORY.OVERSEAS.toString()}>
                        海外
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.locationCategory === LOCATION_CATEGORY.DOMESTIC && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      都道府県
                    </label>
                    <Select
                      value={formData.prefecture?.toString() ?? ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          prefecture: Number(value) as PrefectureId,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            formData.prefecture ? undefined : "都道府県を選択"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PREFECTURES).map(([id, name]) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.prefecture && (
                      <div className="text-red-500 text-xs mt-1">
                        {formErrors.prefecture}
                      </div>
                    )}
                  </div>
                )}
                {formData.locationCategory === LOCATION_CATEGORY.OVERSEAS && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">
                      国名
                    </label>
                    <Select
                      value={formData.country?.toString() ?? ""}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          country: Number(value) as CountryId,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            formData.country ? undefined : "国名を選択"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(COUNTRIES).map(([id, name]) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.country && (
                      <div className="text-red-500 text-xs mt-1">
                        {formErrors.country}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    旅行タイトル <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="旅行のタイトルを入力してください"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                  {formErrors.title && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.title}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">説明</label>
                  <Textarea
                    placeholder="旅行の詳細や感想を入力してください"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      開始日 <span className="text-red-500">*</span>
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate
                            ? format(formData.startDate, "PPP", { locale: ja })
                            : "日付を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.startDate ?? undefined}
                          onSelect={(date) =>
                            setFormData({
                              ...formData,
                              startDate: date ?? null,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.startDate && (
                      <div className="text-red-500 text-xs mt-1">
                        {formErrors.startDate}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      終了日 <span className="text-red-500">*</span>
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate
                            ? format(formData.endDate, "PPP", { locale: ja })
                            : "日付を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.endDate ?? undefined}
                          onSelect={(date) =>
                            setFormData({ ...formData, endDate: date ?? null })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formErrors.endDate && (
                      <div className="text-red-500 text-xs mt-1">
                        {formErrors.endDate}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    公開設定 <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.visibility.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        visibility: Number(value) as Visibility,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VISIBILITY.PUBLIC.toString()}>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2" />
                          公開
                        </div>
                      </SelectItem>
                      <SelectItem value={VISIBILITY.PRIVATE.toString()}>
                        <div className="flex items-center">
                          <Lock className="h-4 w-4 mr-2" />
                          非公開
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.visibility && (
                    <div className="text-red-500 text-xs mt-1">
                      {formErrors.visibility}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 訪問地 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>訪問地</CardTitle>
                  <Button onClick={handleAddLocation} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    場所を追加
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {locations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>まだ訪問地が追加されていません</p>
                    <p className="text-sm">
                      「場所を追加」ボタンから追加してください
                    </p>
                  </div>
                ) : (
                  locations.map((location, index) => (
                    <Card key={location.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium">訪問場所 {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLocation(location.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* 場所名と訪問順を横並び */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            旅程タイトル <span className="text-red-500">*</span>
                          </label>
                          <Input
                            placeholder="旅程リストのタイトルを入力（清水寺参拝、旅館チェックインなど）"
                            value={location.name}
                            onChange={(e) =>
                              handleUpdateLocation(location.id, {
                                name: e.target.value,
                              })
                            }
                          />
                          {formErrors[`location_name_${index}`] && (
                            <div className="text-red-500 text-xs mt-1">
                              {formErrors[`location_name_${index}`]}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            訪問順 <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="number"
                            min={1}
                            value={
                              typeof location.order === "number"
                                ? location.order
                                : index + 1
                            }
                            onChange={(e) =>
                              handleUpdateLocation(location.id, {
                                order: Number(e.target.value),
                              })
                            }
                          />
                          {formErrors[`location_order_${index}`] && (
                            <div className="text-red-500 text-xs mt-1">
                              {formErrors[`location_order_${index}`]}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 訪問日と訪問時間を横並び */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            訪問日 <span className="text-red-500">*</span>
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {location.visitDate
                                  ? format(location.visitDate, "PPP", {
                                      locale: ja,
                                    })
                                  : "日付を選択"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={location.visitDate ?? undefined}
                                onSelect={(date) =>
                                  handleUpdateLocation(location.id, {
                                    visitDate: date ?? null,
                                  })
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          {formErrors[`location_visitDate_${index}`] && (
                            <div className="text-red-500 text-xs mt-1">
                              {formErrors[`location_visitDate_${index}`]}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            訪問時間
                          </label>
                          <Input
                            type="time"
                            value={location.visitTime || ""}
                            onChange={(e) =>
                              handleUpdateLocation(location.id, {
                                visitTime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* 説明 */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          説明
                        </label>
                        <Textarea
                          placeholder="この場所での体験や感想を入力"
                          rows={2}
                          value={location.description}
                          onChange={(e) =>
                            handleUpdateLocation(location.id, {
                              description: e.target.value,
                            })
                          }
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={
                              location.lat && location.lng
                                ? "text-red-500 font-semibold"
                                : "text-black"
                            }
                          >
                            {location.lat && location.lng
                              ? "場所の指定済み"
                              : "場所の指定無し"}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setMapOpenIndex(location.id);
                              setTempLatLng((prev) => ({
                                ...prev,
                                [location.id]:
                                  location.lat && location.lng
                                    ? {
                                        lat: location.lat,
                                        lng: location.lng,
                                      }
                                    : null,
                              }));
                            }}
                          >
                            地図で場所を選ぶ
                          </Button>
                        </div>
                        <Sheet
                          open={mapOpenIndex === location.id}
                          onOpenChange={(open) =>
                            !open && setMapOpenIndex(null)
                          }
                        >
                          <SheetContent
                            side="bottom"
                            className="max-w-2xl mx-auto"
                          >
                            <SheetHeader>
                              <SheetTitle>地図で訪問地を選択</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-4">
                              {/* 選択済みラベルと座標 */}
                              <div className="mb-2">
                                {tempLatLng[location.id] ? (
                                  <span className="text-green-600 font-semibold">
                                    選択済み: 緯度{" "}
                                    {tempLatLng[location.id]?.lat.toFixed(6)},
                                    経度{" "}
                                    {tempLatLng[location.id]?.lng.toFixed(6)}
                                  </span>
                                ) : (
                                  <span className="text-gray-500">未選択</span>
                                )}
                              </div>
                              <MapComponent
                                initialPrefecture={
                                  formData.locationCategory ===
                                  LOCATION_CATEGORY.DOMESTIC
                                    ? getPrefectureNameForMap(
                                        formData.prefecture
                                      )
                                    : undefined
                                }
                                initialCountry={
                                  formData.locationCategory ===
                                  LOCATION_CATEGORY.OVERSEAS
                                    ? getCountryNameForMap(formData.country)
                                    : undefined
                                }
                                markerLatLng={
                                  tempLatLng[location.id] ?? undefined
                                }
                                onMarkerChange={(lat, lng) =>
                                  setTempLatLng((prev) => ({
                                    ...prev,
                                    [location.id]: { lat, lng },
                                  }))
                                }
                                enableSearch={true}
                              />
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="secondary"
                                  onClick={() =>
                                    setTempLatLng((prev) => ({
                                      ...prev,
                                      [location.id]: null,
                                    }))
                                  }
                                >
                                  リセット
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setMapOpenIndex(null)}
                                >
                                  キャンセル
                                </Button>
                                <Button
                                  onClick={() => {
                                    if (tempLatLng[location.id]) {
                                      handleUpdateLocation(location.id, {
                                        lat: tempLatLng[location.id]!.lat,
                                        lng: tempLatLng[location.id]!.lng,
                                      });
                                    } else {
                                      handleUpdateLocation(location.id, {
                                        lat: undefined,
                                        lng: undefined,
                                      });
                                    }
                                    setMapOpenIndex(null);
                                  }}
                                >
                                  この場所に決定
                                </Button>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* 写真アップロード */}
            {/* 写真は地図と同様に各訪問地入力に入れ込んで、訪問地と紐づけるかは検討中 */}
            <Card>
              <CardHeader>
                <CardTitle>写真</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      写真をドラッグ&ドロップするか、クリックして選択してください
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        写真を選択
                      </label>
                    </Button>
                  </div>

                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={
                              URL.createObjectURL(image) || "/placeholder.svg"
                            }
                            alt={`アップロード画像 ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* タグ */}
            <Card>
              <CardHeader>
                <CardTitle>タグ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="タグを入力"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} size="sm">
                      追加
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* プレビュー */}
            <Card>
              <CardHeader>
                <CardTitle>プレビュー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    {selectedImages.length > 0 ? (
                      <img
                        src={
                          URL.createObjectURL(selectedImages[0]) ||
                          "/placeholder.svg"
                        }
                        alt="プレビュー"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-muted-foreground text-sm">
                        画像プレビュー
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold">
                    {formData.title || "タイトルを入力してください"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {formData.description || "説明を入力してください"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

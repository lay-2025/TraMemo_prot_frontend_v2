import { TravelListItem, TravelSearchFilterParams } from "@/types/travel";

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

// モックデータ
const MOCK_TRAVEL_DATA: TravelListItem[] = [
  {
    id: 1,
    title: "京都の古都を巡る旅",
    location: "京都府, 日本",
    date: "2023年10月15日 - 2023年10月20日",
    duration: "6日間",
    images: ["/placeholder.svg?height=300&width=400"],
    description: "京都の伝統的な寺院や庭園を訪れ、日本の歴史と文化に触れる旅。金閣寺、清水寺、伏見稲荷大社など多くの名所を巡りました。",
    user: {
      id: 1,
      name: "田中太郎",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 124,
    commentCount: 18,
    tags: ["京都", "寺院", "日本文化", "紅葉"],
    locationCategory: 0, // 国内
    visibility: 1, // 公開
    createdAt: "2023-10-25T10:00:00Z",
    updatedAt: "2023-10-25T10:00:00Z",
  },
  {
    id: 2,
    title: "バリ島でのリラックス休暇",
    location: "バリ島, インドネシア",
    date: "2023年8月5日 - 2023年8月15日",
    duration: "11日間",
    images: ["/placeholder.svg?height=300&width=400"],
    description: "バリ島の美しいビーチでリラックスし、地元の文化や料理を楽しんだ10日間。ウブドの棚田やウルワツ寺院も訪れました。",
    user: {
      id: 2,
      name: "佐藤花子",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 98,
    commentCount: 12,
    tags: ["バリ島", "ビーチ", "リゾート", "南国"],
    locationCategory: 1, // 海外
    visibility: 1, // 公開
    createdAt: "2023-08-20T14:30:00Z",
    updatedAt: "2023-08-20T14:30:00Z",
  },
  {
    id: 3,
    title: "パリの芸術と食を堪能する旅",
    location: "パリ, フランス",
    date: "2023年6月10日 - 2023年6月17日",
    duration: "8日間",
    images: ["/placeholder.svg?height=300&width=400"],
    description: "ルーブル美術館やオルセー美術館で芸術作品を鑑賞し、パリの美味しいレストランやカフェでフランス料理を堪能しました。",
    user: {
      id: 3,
      name: "鈴木一郎",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 156,
    commentCount: 24,
    tags: ["パリ", "美術館", "フランス料理", "ヨーロッパ"],
    locationCategory: 1, // 海外
    visibility: 1, // 公開
    createdAt: "2023-06-25T09:15:00Z",
    updatedAt: "2023-06-25T09:15:00Z",
  },
  {
    id: 4,
    title: "ニューヨーク市街地探索",
    location: "ニューヨーク, アメリカ",
    date: "2023年4月20日 - 2023年4月27日",
    duration: "8日間",
    images: ["/placeholder.svg?height=300&width=400"],
    description: "マンハッタンの摩天楼、セントラルパーク、ブロードウェイのショーなど、ニューヨークの魅力を存分に味わいました。",
    user: {
      id: 4,
      name: "山田健太",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 87,
    commentCount: 9,
    tags: ["ニューヨーク", "都市", "アメリカ", "観光"],
    locationCategory: 1, // 海外
    visibility: 1, // 公開
    createdAt: "2023-05-05T16:45:00Z",
    updatedAt: "2023-05-05T16:45:00Z",
  },
  {
    id: 5,
    title: "沖縄の美しい海と文化を楽しむ",
    location: "沖縄県, 日本",
    date: "2023年7月1日 - 2023年7月5日",
    duration: "5日間",
    images: ["/placeholder.svg?height=300&width=400"],
    description: "沖縄の美しい海でシュノーケリングを楽しみ、琉球文化に触れる旅。首里城や美ら海水族館も訪れました。",
    user: {
      id: 5,
      name: "高橋美咲",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 203,
    commentCount: 31,
    tags: ["沖縄", "海", "シュノーケリング", "琉球文化"],
    locationCategory: 0, // 国内
    visibility: 1, // 公開
    createdAt: "2023-07-10T11:20:00Z",
    updatedAt: "2023-07-10T11:20:00Z",
  },
  {
    id: 6,
    title: "ローマの歴史遺産を巡る",
    location: "ローマ, イタリア",
    date: "2023年9月15日 - 2023年9月22日",
    duration: "8日間",
    images: ["/placeholder.svg?height=300&width=400"],
    description: "コロッセオ、バチカン市国、フォロ・ロマーノなど、ローマの歴史的建造物を巡る旅。イタリア料理も堪能しました。",
    user: {
      id: 6,
      name: "伊藤雅子",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    likes: 142,
    commentCount: 19,
    tags: ["ローマ", "歴史", "イタリア", "世界遺産"],
    locationCategory: 1, // 海外
    visibility: 1, // 公開
    createdAt: "2023-10-01T13:10:00Z",
    updatedAt: "2023-10-01T13:10:00Z",
  },
];

// モックデータをフィルタリング・ソートする関数
function filterAndSortTravels(
  data: TravelListItem[],
  params: TravelSearchFilterParams
): TravelListItem[] {
  let filtered = [...data];

  // キーワード検索
  if (params.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        item.user.name.toLowerCase().includes(query)
    );
  }

  // 場所カテゴリフィルタ
  if (params.locationCategory !== undefined) {
    filtered = filtered.filter(
      (item) => item.locationCategory === params.locationCategory
    );
  }

  // いいね数フィルタ
  if (params.minLikes) {
    filtered = filtered.filter((item) => item.likes >= params.minLikes!);
  }

  // コメント数フィルタ
  if (params.minComments) {
    filtered = filtered.filter((item) => item.commentCount >= params.minComments!);
  }

  // ソート
  if (params.sortBy) {
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (params.sortBy) {
        case 'likes':
          aValue = a.likes;
          bValue = b.likes;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (params.sortOrder === 'desc') {
        return bValue > aValue ? 1 : -1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
  }

  return filtered;
}

// 旅行記録一覧取得API
export async function getTravelList(
  params: TravelSearchFilterParams = {}
): Promise<TravelListResponse> {
  // モックデータを使用
  const filteredData = filterAndSortTravels(MOCK_TRAVEL_DATA, params);
  
  // ページネーション
  const page = params.page || 1;
  const limit = params.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // 実際のAPI呼び出しの場合は以下のようになります
  // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/travels?${new URLSearchParams(params as any)}`);
  // if (!response.ok) throw new Error("旅行記録の取得に失敗しました");
  // return await response.json();

  return {
    data: paginatedData,
    meta: {
      current_page: page,
      last_page: Math.ceil(filteredData.length / limit),
      per_page: limit,
      total: filteredData.length,
    },
  };
}

// 検索API（将来的に実装）
export async function searchTravels(
  query: string,
  params: TravelSearchFilterParams = {}
): Promise<TravelListResponse> {
  return getTravelList({ ...params, query });
} 
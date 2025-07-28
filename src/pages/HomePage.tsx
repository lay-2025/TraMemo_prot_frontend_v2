import { FeaturedDestinations } from "@/components/featured-destinations";
import { HeroSection } from "@/components/hero-section";
import { TravelCardList } from "@/components/travel-card-list";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <FeaturedDestinations />
      <section className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">最新の旅行記録</h2>
          <a href="/travels" className="text-teal-600 hover:underline">
            すべて見る
          </a>
        </div>
        <TravelCardList />
      </section>

      {/* 仮で旅行記録作成ページへの移動ボタン追加 */}
      {/* <div className="fixed bottom-8 right-8">
        <a
          href="/travels/new"
          className="bg-teal-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-teal-700 transition"
        >
          旅行記録を作成
        </a>
      </div> */}
      <Link to={`/travelCreate`} className="fixed bottom-8 right-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex justify-end mt-2">
              <Button>投稿する</Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

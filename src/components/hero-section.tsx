import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-90" />
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center mix-blend-overlay" />

      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          あなたの旅の思い出を
          <br className="md:hidden" />
          記録しよう
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Travel Memoryで旅の記録を残し、世界中の旅人と繋がりましょう。 写真、地図、思い出を一つの場所に。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-teal-600 hover:bg-white/90">
            <Link to="/auth/register">無料で始める</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link to="/about">詳しく見る</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

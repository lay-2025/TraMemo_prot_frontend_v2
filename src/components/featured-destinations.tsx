import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import { Link } from "react-router-dom"

const FEATURED_DESTINATIONS = [
  {
    id: 1,
    name: "京都",
    image: "/placeholder.svg?height=200&width=300",
    count: 245,
  },
  {
    id: 2,
    name: "バリ島",
    image: "/placeholder.svg?height=200&width=300",
    count: 189,
  },
  {
    id: 3,
    name: "パリ",
    image: "/placeholder.svg?height=200&width=300",
    count: 312,
  },
  {
    id: 4,
    name: "ニューヨーク",
    image: "/placeholder.svg?height=200&width=300",
    count: 278,
  },
]

export function FeaturedDestinations() {
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold mb-6">人気の旅行先</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURED_DESTINATIONS.map((destination) => (
          <Link to={`/destinations/${destination.id}`} key={destination.id}>
            <Card className="overflow-hidden h-full transition-transform hover:scale-[1.02]">
              <div className="relative h-40">
                <img
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-teal-600" />
                    <h3 className="font-semibold">{destination.name}</h3>
                  </div>
                  <Badge variant="secondary">{destination.count}件の記録</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, MapPin, Calendar } from "lucide-react"

interface TravelCardProps {
  travel: {
    id: number
    title: string
    location: string
    date: string
    images: string[]
    description: string
    user: {
      name: string
      avatar: string
    }
    likes: number
    comments: number
    tags: string[]
  }
}

export function TravelCard({ travel }: TravelCardProps) {
  return (
    <Card className="overflow-hidden h-full">
      <Link to={`/travels/${travel.id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={travel.images[0] || "/placeholder.svg"}
            alt={travel.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/travels/${travel.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg line-clamp-2">{travel.title}</h3>
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

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{travel.description}</p>

        <div className="flex flex-wrap gap-1 mb-4">
          {travel.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Link to={`/users/${travel.user.name}`} className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={travel.user.avatar || "/placeholder.svg"} alt={travel.user.name} />
              <AvatarFallback>{travel.user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{travel.user.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">{travel.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{travel.comments}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface StatusCardProps {
  status: {
    _id: string
    content: string
    author: {
      _id: string
      name: string
      image?: string
    }
    createdAt: string
    likes: string[]
    images?: string[]
  }
}

export default function StatusCard({ status }: StatusCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          {status.author.image ? (
            <AvatarImage src={status.author.image} alt={status.author.name} />
          ) : (
            <AvatarFallback>{status.author.name.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold">{status.author.name}</p>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(status.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap">{status.content}</p>
        {status.images && status.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {status.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Status image ${index + 1}`}
                className="rounded-lg object-cover w-full h-48"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

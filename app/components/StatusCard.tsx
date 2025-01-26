import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import StatusConversation from "./StatusConversation"

interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    name: string
    image?: string
  }
  createdAt: string
}

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
    comments: Comment[]
    images?: string[]
  }
  onStatusUpdate: (statusId: string, newStatus: {
    _id: string
    content: string
    author: {
      _id: string
      name: string
      image?: string
    }
    createdAt: string
    likes: string[]
    comments: Comment[]
    images?: string[]
  }) => void
}

export default function StatusCard({ status, onStatusUpdate }: StatusCardProps) {
  const { user } = useAuth()
  const [isConversationOpen, setIsConversationOpen] = useState(false)
  const { toast } = useToast()
  const [isLiked, setIsLiked] = useState(status.likes.includes(user?._id || ""))
  const [likesCount, setLikesCount] = useState(status.likes.length)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [newComment, setNewComment] = useState("")

  const handleLike = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/statuses/${status._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setIsLiked(!isLiked)
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
        const updatedStatus = await response.json()
        onStatusUpdate(status._id, updatedStatus)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like the status",
        variant: "destructive",
      })
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    try {
      const response = await fetch(`/api/statuses/${status._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        const updatedStatus = await response.json()
        onStatusUpdate(status._id, updatedStatus)
        setNewComment("")
        setShowCommentInput(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          {status.author.image ? (
            <AvatarImage src={status.author.image} alt={status.author.name} />
          ) : (
            <AvatarFallback>?</AvatarFallback>
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

        <div className="mt-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            {likesCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => setShowCommentInput(!showCommentInput)}
          >
            <MessageCircle className="h-5 w-5" />
            {status.comments.length}
          </Button>
        </div>

        {status.comments.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-6 w-6">
                {status.comments[0].author.image ? (
                  <AvatarImage
                    src={status.comments[0].author.image}
                    alt={status.comments[0].author.name}
                  />
                ) : (
                  <AvatarFallback>
                    ?
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">
                    {status.comments[0].author.name}
                  </span>{" "}
                  {status.comments[0].content}
                </p>
              </div>
            </div>
            {status.comments.length > 1 && (
              <Button
              variant="link"
              className="mt-2 h-auto p-0 text-sm text-gray-500"
              onClick={() => setIsConversationOpen(true)}
            >
              View all {status.comments.length} comments
            </Button>
            )}
          </div>
        )}

        {showCommentInput && (
          <form onSubmit={handleComment} className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-md border p-2 text-sm"
              />
              <Button type="submit" disabled={!newComment.trim()}>
                Post
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <StatusConversation
        isOpen={isConversationOpen}
        onClose={() => setIsConversationOpen(false)}
        status={status}
        onStatusUpdate={onStatusUpdate}
      />
    </Card>
  )
}

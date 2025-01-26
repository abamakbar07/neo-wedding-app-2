import { Dialog, DialogContent } from "@/components/ui/dialog"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"

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

interface StatusConversationProps {
  isOpen: boolean
  onClose: () => void
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
  onStatusUpdate: (statusId: string, newStatus: any) => void
}

export default function StatusConversation({
  isOpen,
  onClose,
  status,
  onStatusUpdate,
}: StatusConversationProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [newComment, setNewComment] = useState("")
  const [isLiked, setIsLiked] = useState(status.likes.includes(user?._id || ""))
  const [likesCount, setLikesCount] = useState(status.likes.length)

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Original Status */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                {status.author.image ? (
                  <AvatarImage src={status.author.image} alt={status.author.name} />
                ) : (
                  <AvatarFallback>{status.author.name.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-semibold">{status.author.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(status.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
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
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-5 w-5" />
                {status.comments.length}
              </Button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            {status.comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  {comment.author.image ? (
                    <AvatarImage src={comment.author.image} alt={comment.author.name} />
                  ) : (
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="font-semibold text-sm">{comment.author.name}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div className="border-t p-4">
          <form onSubmit={handleComment} className="flex gap-2">
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
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
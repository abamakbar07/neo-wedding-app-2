import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  content: { type: String, required: true },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
})

const StatusSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  images: [{ type: String }], // Optional array of image URLs
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Ensure virtual fields are included when converting to JSON
StatusSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret._id = ret._id.toString()
    if (ret.author._id) ret.author._id = ret.author._id.toString()
    if (ret.likes) ret.likes = ret.likes.map((id: any) => id.toString())
    if (ret.comments) {
      ret.comments = ret.comments.map((comment: any) => ({
        ...comment,
        _id: comment._id.toString(),
        author: {
          ...comment.author,
          _id: comment.author._id.toString()
        }
      }))
    }
    return ret
  }
})

export default mongoose.models.Status || mongoose.model("Status", StatusSchema)

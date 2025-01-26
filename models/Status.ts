import mongoose from "mongoose"

const StatusSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  images: [{ type: String }], // Optional array of image URLs
})

export default mongoose.models.Status || mongoose.model("Status", StatusSchema)

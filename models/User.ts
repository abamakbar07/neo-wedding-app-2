import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: "" },
  bio: { type: String, default: "" },
  createdEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
})

export default mongoose.models.User || mongoose.model("User", UserSchema)


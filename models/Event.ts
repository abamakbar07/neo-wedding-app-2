import mongoose from "mongoose"

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  invitationCode: { type: String, required: true, unique: true },
  guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  customization: {
    layout: { type: String, enum: ["classic", "modern", "rustic"], default: "classic" },
    primaryColor: { type: String, default: "#000000" },
    secondaryColor: { type: String, default: "#ffffff" },
    fontFamily: { type: String, default: "Inter" },
    heroImage: { type: String, default: "" },
  },
})

export default mongoose.models.Event || mongoose.model("Event", EventSchema)


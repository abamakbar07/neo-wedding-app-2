import mongoose from "mongoose"

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    mapsLink: { type: String },
  },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  invitationCode: { type: String, required: true, unique: true },
  guests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  contactInfo: {
    brideContact: { type: String, required: true },
    groomContact: { type: String, required: true },
    rsvpContact: { type: String, required: true },
  },
  customization: {
    layout: { type: String, enum: ["classic", "modern", "rustic"], default: "classic" },
    primaryColor: { type: String, default: "#000000" },
    secondaryColor: { type: String, default: "#ffffff" },
    fontFamily: { type: String, default: "Inter" },
    heroImage: { type: String, default: "" },
  },
  schedule: [{
    time: { type: String, required: true },
    activity: { type: String, required: true },
  }],
  giftInfo: {
    bankAccount: { type: String },
    message: { type: String },
  },
})

export default mongoose.models.Event || mongoose.model("Event", EventSchema)

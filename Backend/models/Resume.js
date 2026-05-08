const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  location: { type: String },
  summary: { type: String },
  experienceLevel: { type: String, enum: ["Fresher", "Experienced"], default: "Fresher" },
  sections: [
    {
      id: { type: String },
      title: { type: String },
      type: { type: String },
      content: { type: mongoose.Schema.Types.Mixed },
      isEnabled: { type: Boolean, default: true },
      order: { type: Number },
    },
  ],
  atsScore: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);

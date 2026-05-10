import mongoose, { Schema } from "mongoose";

const GalleryItemSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String, default: "" },
    title: { type: String, default: "" },
    brand: { type: String, default: "" },
    tag: {
      type: String,
      enum: ["กรอบสายตา", "แว่นกันแดด", "เลนส์", "อื่นๆ", ""],
      default: "",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const GalleryItem =
  mongoose.models.GalleryItem ||
  mongoose.model("GalleryItem", GalleryItemSchema);

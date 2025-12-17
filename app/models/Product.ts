// app/models/Product.ts
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },

    slug: { type: String, required: true, unique: true },

    price: { type: Number, required: true },

    category: {
      type: String,
      enum: ["optical", "sun", "lens"],
      required: true,
    },

    color: {
      type: String,
      enum: ["black", "gold", "silver", "brown", "clear"],
      required: true,
    },

    stock: { type: Number, required: true, default: 0, min: 0 },

    description: { type: String, default: "" },
    tag: { type: String, default: "" },
    isRecommended: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },

    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

// ✅ type ของข้อมูลตาม schema (ยังไม่ใช่ document)
export type ProductSchemaType = InferSchemaType<typeof ProductSchema>;

// ✅ document แบบ hydrated ของ mongoose (มี _id, save, etc.)
export type ProductDocument = mongoose.HydratedDocument<ProductSchemaType>;

// ✅ สำคัญ: cast models.Product ให้เป็น Model<ProductSchemaType> เพื่อไม่ให้ TS แดง
export const Product =
  (mongoose.models.Product as mongoose.Model<ProductSchemaType>) ||
  mongoose.model<ProductSchemaType>("Product", ProductSchema);

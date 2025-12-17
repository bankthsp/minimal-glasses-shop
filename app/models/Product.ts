// app/models/Product.ts
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },

    // ✅ เพิ่ม: slug สำหรับทำ URL/ค้นหา/กันชื่อซ้ำ
    slug: { type: String, required: true, unique: true },

    price: { type: Number, required: true },

    category: {
      type: String,
      enum: ["optical", "sun", "lens"],
      required: true,
    },

    // ของเดิม: color
    color: {
      type: String,
      enum: ["black", "gold", "silver", "brown", "clear"],
      required: true,
    },

    // ✅ เพิ่ม: stock เป็นตัวเลข (เอาไว้ “ตัดสต็อก” ตอนทำ checkout จริง)
    // ปล่อยให้ค่าเดิมอยู่ด้วย (inStock) เพื่อไม่พังของเก่า
    stock: { type: Number, required: true, default: 0, min: 0 },

    description: { type: String, default: "" },
    tag: { type: String, default: "" },
    isRecommended: { type: Boolean, default: false },

    // ของเดิม: inStock (boolean)
    //inStock: { type: Boolean, default: true },

    // ✅ เพิ่ม: เปิด/ปิดการแสดงผลสินค้า (ซ่อนสินค้าในหน้าบ้านได้)
    isActive: { type: Boolean, default: true },

    // ของเดิม: images แต่ใส่ default ให้ชัวร์
    images: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

// document type (มี _id อยู่)
export type ProductDocument = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Product: Model<ProductDocument> =
  mongoose.models.Product || mongoose.model<ProductDocument>("Product", ProductSchema);

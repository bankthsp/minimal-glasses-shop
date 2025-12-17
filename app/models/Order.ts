import mongoose, { Schema, Document, models, model } from "mongoose";

type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export interface OrderDocument extends Document {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  paymentMethod: "bank_transfer" | "cash_on_pickup";
  status: "pending" | "confirmed" | "cancelled";
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  {
    _id: false, // ไม่ต้องให้ mongoose สร้าง _id แยกต่อ item
  }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    note: { type: String },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "cash_on_pickup"],
      default: "bank_transfer",
    },
    status: {
    type: String,
    enum: ["pending", "paid", "shipped", "completed", "cancelled"],
    default: "pending",
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ให้เวลาแปลงเป็น JSON จะได้ id แทน _id เหมือน Product
OrderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = ret as any;

    if (r._id) {
      r.id = r._id.toString();
      delete r._id;
    }

    return r;
  },
});


export const Order =
  (models.Order as mongoose.Model<OrderDocument>) ||
  model<OrderDocument>("Order", OrderSchema);

// app/gallery/data.ts
// เพิ่ม/แก้รูปที่นี่ได้เลย — ใส่ URL จาก Cloudinary, Facebook CDN หรือที่อื่น
// imageUrl: ลิงก์รูปภาพ (แนะนำ Cloudinary หรือ upload ไว้ใน /public/gallery/)
// tag: ป้ายกำกับด้านบน
// title: ชื่อสินค้า (ใส่หรือไม่ใส่ก็ได้)
// brand: ยี่ห้อ

export type GalleryItem = {
  id: string;
  imageUrl: string;
  title?: string;
  brand?: string;
  tag?: "กรอบสายตา" | "แว่นกันแดด" | "เลนส์" | "อื่นๆ";
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    imageUrl: "/gallery/placeholder-1.jpg",
    brand: "Paul Hueman",
    title: "แว่นกันแดด Round Silver",
    tag: "แว่นกันแดด",
  },
  {
    id: "g2",
    imageUrl: "/gallery/placeholder-2.jpg",
    brand: "Paul Hueman",
    title: "กรอบ Aviator Slim",
    tag: "กรอบสายตา",
  },
  {
    id: "g3",
    imageUrl: "/gallery/placeholder-3.jpg",
    brand: "Paul Hueman",
    title: "กรอบ Oval Classic",
    tag: "กรอบสายตา",
  },
  {
    id: "g4",
    imageUrl: "/gallery/placeholder-4.jpg",
    brand: "Teeramon Optic",
    title: "แว่นสายตาโปรเกรสซีฟ",
    tag: "เลนส์",
  },
  {
    id: "g5",
    imageUrl: "/gallery/placeholder-5.jpg",
    brand: "Teeramon Optic",
    title: "กรอบ Minimal Square",
    tag: "กรอบสายตา",
  },
  {
    id: "g6",
    imageUrl: "/gallery/placeholder-6.jpg",
    brand: "Paul Hueman",
    title: "แว่นกันแดด Wayfarer",
    tag: "แว่นกันแดด",
  },
];

export const FACEBOOK_URL = "https://www.facebook.com/teeramonoptics";

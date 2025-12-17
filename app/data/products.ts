// app/data/products.ts
export type ProductCategory = "optical" | "sun" | "lens";
export type ProductColor = "black" | "gold" | "silver" | "brown" | "clear";

export interface Product {
  id: string;
  name: string;
  price: number;
  color: ProductColor;
  category: ProductCategory;
  tag: string;
  inStock: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "กรอบแว่น Minimal ดำด้าน",
    price: 2490,
    color: "black",
    category: "optical",
    tag: "เหมาะกับทำงาน/ทางการ",
    inStock: true,
  },
  {
    id: "2",
    name: "กรอบแว่น ทอง Minimal",
    price: 3200,
    color: "gold",
    category: "optical",
    tag: "ลุคสุภาพ เรียบหรู",
    inStock: true,
  },
  {
    id: "3",
    name: "กรอบแว่น สีเงิน บางพิเศษ",
    price: 2890,
    color: "silver",
    category: "optical",
    tag: "น้ำหนักเบา ใส่สบาย",
    inStock: true,
  },
  {
    id: "4",
    name: "กรอบแว่น ทูโทน น้ำตาล/ใส",
    price: 2690,
    color: "brown",
    category: "optical",
    tag: "สายแฟฯ มินิมอล",
    inStock: false,
  },
  {
    id: "5",
    name: "แว่นกันแดด Minimal ดำ",
    price: 3590,
    color: "black",
    category: "sun",
    tag: "กรองแสง UV400",
    inStock: true,
  },
  {
    id: "6",
    name: "เลนส์โปรเกรสซีฟ (ตัวอย่าง)",
    price: 8900,
    color: "clear",
    category: "lens",
    tag: "เหมาะกับผู้ใช้หลายระยะ",
    inStock: true,
  },
];

export function getProductById(id: string) {
  return mockProducts.find((p) => p.id === id);
}

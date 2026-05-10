import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Gallery | Teeramon Optic",
  description: "แกลเลอรีกรอบแว่นและแว่นกันแดดจาก Teeramon Optic",
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

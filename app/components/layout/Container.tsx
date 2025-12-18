// components/layout/Container.tsx
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={"mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 " + className}>
      {children}
    </div>
  );
}

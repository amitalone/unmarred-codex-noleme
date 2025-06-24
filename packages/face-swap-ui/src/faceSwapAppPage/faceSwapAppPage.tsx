import { type ReactNode } from "react";

export interface FaceSwapAppPageProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FaceSwapAppPage({
  title,
  children,
  className = "",
}: FaceSwapAppPageProps) {
  return (
    <div className={`face-swap-app-page ${className}`}>
      <h2 className="face-swap-app-page__title">{title}</h2>
      {children}
    </div>
  );
}

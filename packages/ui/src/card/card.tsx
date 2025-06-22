import { type ReactNode } from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="card">
      <h3 className="card__title">{title}</h3>
      <div className="card__content">{children}</div>
    </div>
  );
}

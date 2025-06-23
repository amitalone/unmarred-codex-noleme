import { type ReactNode } from "react";
import { Button } from "@repo/design-system/button";

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
      <Button>Card Action</Button>
    </div>
  );
}

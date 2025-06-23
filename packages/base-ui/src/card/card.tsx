import { type ReactNode } from "react";
import { Button } from "@repo/design-system/button";
import { IconClose, IconMenu } from "@repo/design-system/icons";
export function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="card">
      <IconMenu color="red" /> <h3 className="card__title">{title}</h3>
      <div className="card__content">{children}</div>
      <Button text="Explore Code B" /> <IconClose />
    </div>
  );
}

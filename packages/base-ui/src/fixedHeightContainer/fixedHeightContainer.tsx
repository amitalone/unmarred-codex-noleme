import { type ReactNode } from "react";

type FixedHeightContainerProps = {
  height?: string;
  children: ReactNode;
  className?: string;
};

export function FixedHeightContainer({
  height = "85vh",
  children,
  className = "",
}: FixedHeightContainerProps) {
  const heightStyle = { height };

  return (
    <div
      className={`fixed-height-container overflow-y-auto ${className}`}
      data-testid="fixed-height-container"
      style={heightStyle}
    >
      {children}
    </div>
  );
}

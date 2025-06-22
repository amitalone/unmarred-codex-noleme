import { type ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className="button"
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

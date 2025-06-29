import { Button as FlowButton } from "flowbite-react";
export interface ButtonProps {
  onClick?: () => void;
  text?: string;
  children?: React.ReactNode;
  pill?: boolean;
  className?: string;
  disabled?: boolean;
}

export function Button({
  onClick,
  text,
  children,
  pill,
  className,
  disabled,
}: ButtonProps) {
  return (
    <FlowButton
      role="button"
      color="blue"
      onClick={onClick}
      className={`${className}`}
      pill={pill}
      disabled={disabled}
    >
      {children || text}
    </FlowButton>
  );
}

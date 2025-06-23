import { Button as FlowButton } from "flowbite-react";
export interface ButtonProps {
  onClick?: () => void;
  text?: string;
}

export function Button({ onClick, text }: ButtonProps) {
  return (
    <FlowButton role="button" color="blue" onClick={onClick}>
      {text || "Red"}
    </FlowButton>
  );
}

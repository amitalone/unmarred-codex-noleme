import { Button as FlowButton } from "flowbite-react";
export interface ButtonProps {
  onClick?: () => void;
}

export function Button({ onClick }: ButtonProps) {
  return (
    <FlowButton role="button" color="blue" onClick={onClick}>
      Red
    </FlowButton>
  );
}

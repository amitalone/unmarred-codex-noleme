import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./button";

// Mock the flowbite-react Button component
jest.mock("flowbite-react", () => ({
  Button: ({
    children,
    onClick,
    color,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    color: string;
  }) => (
    <button onClick={onClick} data-color={color}>
      {children}
    </button>
  ),
}));

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toHaveTextContent("Red");
    screen.debug();
    expect(screen.getByRole("button")).toHaveAttribute("data-color", "blue");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

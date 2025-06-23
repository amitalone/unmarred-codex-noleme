import { render, screen, fireEvent } from "@testing-library/react";
import { Drawer } from "./drawer";

describe("Drawer", () => {
  it("renders correctly when open", () => {
    const onCloseMock = jest.fn();
    render(
      <Drawer open={true} onClose={onCloseMock} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );

    expect(screen.getByText("Test Drawer")).toBeInTheDocument();
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    const onCloseMock = jest.fn();
    render(
      <Drawer open={false} onClose={onCloseMock} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );

    // This will depend on how Flowbite-React implements the hidden drawer
    // You might need to adjust this expectation based on the actual implementation
    expect(screen.queryByText("Test Drawer")).not.toBeVisible();
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(
      <Drawer open={true} onClose={onCloseMock} title="Test Drawer">
        <p>Drawer content</p>
      </Drawer>
    );

    // Find the close button and click it
    // This might need adjustment based on how Flowbite implements the close button
    const closeButton = screen.getByLabelText("Close");
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("renders without a title", () => {
    const onCloseMock = jest.fn();
    render(
      <Drawer open={true} onClose={onCloseMock}>
        <p>Drawer content</p>
      </Drawer>
    );

    expect(screen.queryByText("Test Drawer")).not.toBeInTheDocument();
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const onCloseMock = jest.fn();
    render(
      <Drawer open={true} onClose={onCloseMock} className="custom-class">
        <p>Drawer content</p>
      </Drawer>
    );

    // This test might need adjustment based on how Flowbite React handles classNames
    // You might need to check for specific elements that should receive the className
    const drawerElement = screen
      .getByText("Drawer content")
      .closest(".custom-class");
    expect(drawerElement).toBeInTheDocument();
  });
});

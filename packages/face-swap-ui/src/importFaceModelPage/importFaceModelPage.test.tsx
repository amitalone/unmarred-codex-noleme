/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImportFaceModelPage } from "./importFaceModelPage";
import { type ImportFaceModelPageActions } from "./importFaceModelPage.event.handler";

// Mock the dependencies
jest.mock("@repo/base-ui/fixedHeightContainer", () => ({
  FixedHeightContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fixed-height-container">{children}</div>
  ),
}));

jest.mock("../faceSwapAppPage", () => ({
  FaceSwapAppPage: ({
    children,
    title,
    className,
  }: {
    children: React.ReactNode;
    title: string;
    className: string;
  }) => (
    <div data-testid="face-swap-app-page" title={title} className={className}>
      {children}
    </div>
  ),
}));

jest.mock("@repo/design-system/button", () => ({
  Button: ({
    children,
    text,
    onClick,
    className,
    "data-testid": testId,
  }: {
    children?: React.ReactNode;
    text?: string;
    onClick: () => void;
    className?: string;
    "data-testid"?: string;
  }) => (
    <button onClick={onClick} className={className} data-testid={testId}>
      {children || text}
    </button>
  ),
}));

describe("ImportFaceModelPage", () => {
  const mockActions: ImportFaceModelPageActions = {
    onAccept: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with default title", () => {
    render(<ImportFaceModelPage actions={mockActions} />);

    expect(screen.getByTestId("face-swap-app-page")).toBeInTheDocument();
    expect(screen.getByTestId("fixed-height-container")).toBeInTheDocument();
    expect(screen.getByText("Select Import Type")).toBeInTheDocument();
    expect(screen.getByTestId("accept-button")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(
      <ImportFaceModelPage actions={mockActions} title="Custom Import Title" />
    );

    const pageElement = screen.getByTestId("face-swap-app-page");
    expect(pageElement).toHaveAttribute("title", "Custom Import Title");
  });

  it("renders radio buttons for face and model", () => {
    render(<ImportFaceModelPage actions={mockActions} />);

    expect(screen.getByTestId("radio-face")).toBeInTheDocument();
    expect(screen.getByTestId("radio-model")).toBeInTheDocument();
    expect(screen.getByTestId("radio-label-face")).toBeInTheDocument();
    expect(screen.getByTestId("radio-label-model")).toBeInTheDocument();
  });

  it("initially has no radio button selected", () => {
    render(<ImportFaceModelPage actions={mockActions} />);

    const faceRadio = screen.getByTestId("radio-face") as HTMLInputElement;
    const modelRadio = screen.getByTestId("radio-model") as HTMLInputElement;

    expect(faceRadio.checked).toBe(false);
    expect(modelRadio.checked).toBe(false);
  });

  it("allows selecting face radio button", () => {
    render(<ImportFaceModelPage actions={mockActions} />);

    const faceRadio = screen.getByTestId("radio-face") as HTMLInputElement;
    const modelRadio = screen.getByTestId("radio-model") as HTMLInputElement;

    fireEvent.click(faceRadio);

    expect(faceRadio.checked).toBe(true);
    expect(modelRadio.checked).toBe(false);
  });

  it("allows selecting model radio button", () => {
    render(<ImportFaceModelPage actions={mockActions} />);

    const faceRadio = screen.getByTestId("radio-face") as HTMLInputElement;
    const modelRadio = screen.getByTestId("radio-model") as HTMLInputElement;

    fireEvent.click(modelRadio);

    expect(faceRadio.checked).toBe(false);
    expect(modelRadio.checked).toBe(true);
  });

  it("allows switching between radio button selections", () => {
    render(<ImportFaceModelPage actions={mockActions} />);

    const faceRadio = screen.getByTestId("radio-face") as HTMLInputElement;
    const modelRadio = screen.getByTestId("radio-model") as HTMLInputElement;

    // First select face
    fireEvent.click(faceRadio);
    expect(faceRadio.checked).toBe(true);
    expect(modelRadio.checked).toBe(false);

    // Then select model
    fireEvent.click(modelRadio);
    expect(faceRadio.checked).toBe(false);
    expect(modelRadio.checked).toBe(true);
  });

  it("calls onAccept with face when accept button is clicked with face selected", () => {
    render(<ImportFaceModelPage actions={mockActions} />);

    const faceRadio = screen.getByTestId("radio-face");
    const acceptButton = screen.getByTestId("accept-button");

    fireEvent.click(faceRadio);
    fireEvent.click(acceptButton);

    expect(mockActions.onAccept).toHaveBeenCalledWith("face");
  });

  it("calls onAccept with model when accept button is clicked with model selected", () => {
    render(<ImportFaceModelPage actions={mockActions} />);

    const modelRadio = screen.getByTestId("radio-model");
    const acceptButton = screen.getByTestId("accept-button");

    fireEvent.click(modelRadio);
    fireEvent.click(acceptButton);

    expect(mockActions.onAccept).toHaveBeenCalledWith("model");
  });

  it("does not call onAccept when accept button is clicked with no selection", () => {
    render(<ImportFaceModelPage actions={mockActions} />);

    const acceptButton = screen.getByTestId("accept-button");

    fireEvent.click(acceptButton);

    expect(mockActions.onAccept).not.toHaveBeenCalled();
  });

  it("renders additional children content", () => {
    render(
      <ImportFaceModelPage actions={mockActions}>
        <div data-testid="additional-content">Extra content</div>
      </ImportFaceModelPage>
    );

    expect(screen.getByTestId("additional-content")).toBeInTheDocument();
    expect(screen.getByText("Extra content")).toBeInTheDocument();
  });
});

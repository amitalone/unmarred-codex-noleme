import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectedMaceModelContainer } from "./selectedMaceModelContainer";
import "@testing-library/jest-dom";
import { FaceImage, ModelImage } from "@repo/shared-interfaces";

// Mock data
const mockFaceImages: FaceImage[] = [
  {
    name: "face1.jpg",
    src: "/images/faces/face1.jpg",
    alt: "Face 1",
    type: "Face",
  },
  {
    name: "face2.jpg",
    src: "/images/faces/face2.jpg",
    alt: "Face 2",
    type: "Face",
  },
];

const mockModelImages: ModelImage[] = [
  {
    name: "model1.jpg",
    src: "/images/models/model1.jpg",
    alt: "Model 1",
    type: "Model",
  },
];

describe("SelectedMaceModelContainer", () => {
  it("renders the toggle button", () => {
    render(<SelectedMaceModelContainer />);
    const toggleButton = screen.getByTestId(
      "selected-mace-model-toggle-button"
    );
    expect(toggleButton).toBeInTheDocument();
  });

  it("shows badge with total number of selected items", () => {
    render(
      <SelectedMaceModelContainer
        selectedFaces={mockFaceImages}
        selectedModels={mockModelImages}
      />
    );

    // Check for the badge element
    const button = screen.getByTestId("selected-mace-model-toggle-button");
    expect(button).toHaveClass(
      "selected-mace-model-container__button--has-items"
    );

    const badge = button.querySelector(".selected-mace-model-container__badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("3"); // 2 faces + 1 model
  });

  it("opens drawer when toggle button is clicked", () => {
    render(<SelectedMaceModelContainer />);

    // Get the button and click it
    const button = screen.getByTestId("selected-mace-model-toggle-button");
    fireEvent.click(button);

    // Check if drawer is now open
    const drawer = screen.getByTestId("selected-mace-model-container-drawer");
    expect(drawer).toBeInTheDocument();
  });

  it("displays selected face and model images when drawer is open", () => {
    render(
      <SelectedMaceModelContainer
        selectedFaces={mockFaceImages}
        selectedModels={mockModelImages}
      />
    );

    // Open the drawer
    const button = screen.getByTestId("selected-mace-model-toggle-button");
    fireEvent.click(button);

    // Check if face images are displayed
    const faceItems = screen.getAllByTestId("selected-face-image-item");
    expect(faceItems).toHaveLength(mockFaceImages.length);

    // Check if model images are displayed
    const modelItems = screen.getAllByTestId("selected-model-image-item");
    expect(modelItems).toHaveLength(mockModelImages.length);
  });

  it("shows empty state when no images are selected", () => {
    render(<SelectedMaceModelContainer />);

    // Open the drawer
    const button = screen.getByTestId("selected-mace-model-toggle-button");
    fireEvent.click(button);

    // Check for empty state message
    expect(screen.getByText("No images selected.")).toBeInTheDocument();
  });

  it("calls onClearSelection when clear button is clicked", () => {
    const mockClearSelection = jest.fn();

    render(
      <SelectedMaceModelContainer
        selectedFaces={mockFaceImages}
        selectedModels={mockModelImages}
        onClearSelection={mockClearSelection}
      />
    );

    // Open the drawer
    const button = screen.getByTestId("selected-mace-model-toggle-button");
    fireEvent.click(button);

    // Find and click the clear button
    const clearButton = screen.getByTestId("selected-mace-model-clear-button");
    fireEvent.click(clearButton);

    // Check if the callback was called
    expect(mockClearSelection).toHaveBeenCalledTimes(1);
  });
});

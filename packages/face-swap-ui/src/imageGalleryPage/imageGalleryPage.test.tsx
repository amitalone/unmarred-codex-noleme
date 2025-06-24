import { render, screen } from "@testing-library/react";
import { ImageGalleryPagePage as FaceModelPage } from "./imageGalleryPage";

const mockImages = [
  {
    src: "https://dummyimage.com/900x700/FF338C/fff&text=Face1",
    alt: "Face image 1",
    width: 900,
    height: 700,
    type: "Face",
  },
  {
    src: "https://dummyimage.com/600x800/33FF57/000&text=Face2",
    alt: "Face image 2",
    width: 600,
    height: 800,
    type: "Face",
  },
];

describe("FacePage", () => {
  it("renders with default title", () => {
    render(<FaceModelPage images={mockImages} />);
    expect(screen.getByText("Faces")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(<FaceModelPage images={mockImages} title="Custom Face Title" />);
    expect(screen.getByText("Custom Face Title")).toBeInTheDocument();
  });

  it("renders images in a masonry grid", () => {
    render(<FaceModelPage images={mockImages} />);
    // Check for presence of action buttons
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
    expect(screen.getByTestId("bookmark-button")).toBeInTheDocument();
    expect(screen.getByTestId("select-button")).toBeInTheDocument();
  });
});

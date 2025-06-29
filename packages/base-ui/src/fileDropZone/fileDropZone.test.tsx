import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileDropZone } from "./fileDropZone";

describe("FileDropZone", () => {
  it("renders with default props", () => {
    render(<FileDropZone />);

    expect(screen.getByText("Click to upload")).toBeInTheDocument();
    expect(screen.getByText("or drag and drop")).toBeInTheDocument();
    expect(
      screen.getByText("SVG, PNG, JPG or GIF (MAX. 800x400px)")
    ).toBeInTheDocument();
  });

  it("renders with custom title and subtitle", () => {
    render(
      <FileDropZone
        title="Custom upload"
        subtitle="custom drag text"
        helperText="Custom helper text"
      />
    );

    expect(screen.getByText("Custom upload")).toBeInTheDocument();
    expect(screen.getByText("custom drag text")).toBeInTheDocument();
    expect(screen.getByText("Custom helper text")).toBeInTheDocument();
  });

  it("calls onChange when file is selected", () => {
    const handleChange = jest.fn();
    render(<FileDropZone onChange={handleChange} />);

    const fileInput = screen.getByRole("textbox", { hidden: true });
    const file = new File(["test"], "test.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("applies disabled state correctly", () => {
    render(<FileDropZone disabled />);

    const fileInput = screen.getByRole("textbox", { hidden: true });
    expect(fileInput).toBeDisabled();
  });

  it("handles drag events", () => {
    const handleDrop = jest.fn();
    const handleDragOver = jest.fn();
    const handleDragLeave = jest.fn();

    render(
      <FileDropZone
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      />
    );

    const dropZone = screen.getByLabelText(/click to upload/i);

    fireEvent.dragOver(dropZone);
    expect(handleDragOver).toHaveBeenCalled();

    fireEvent.dragLeave(dropZone);
    expect(handleDragLeave).toHaveBeenCalled();

    fireEvent.drop(dropZone);
    expect(handleDrop).toHaveBeenCalled();
  });

  it("accepts multiple files when multiple prop is true", () => {
    render(<FileDropZone multiple />);

    const fileInput = screen.getByRole("textbox", { hidden: true });
    expect(fileInput).toHaveAttribute("multiple");
  });

  it("applies custom className", () => {
    const { container } = render(<FileDropZone className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
  });
});

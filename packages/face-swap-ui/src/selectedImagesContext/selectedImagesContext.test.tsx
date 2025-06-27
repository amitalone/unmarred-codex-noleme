import React from "react";
import {
  render,
  screen,
  fireEvent,
  renderHook,
  act,
} from "@testing-library/react";
import {
  SelectedImagesProvider,
  useSelectedImages,
} from "./selectedImagesContext";

// Mock data
const mockFace = {
  src: "/test-face.jpg",
  name: "Test Face",
  type: "Face" as const,
};

const mockModel = {
  src: "/test-model.jpg",
  name: "Test Model",
  type: "Model" as const,
};

describe("SelectedImagesContext", () => {
  it("should add and remove faces correctly", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SelectedImagesProvider>{children}</SelectedImagesProvider>
    );

    const { result } = renderHook(() => useSelectedImages(), { wrapper });

    // Initial state should be empty arrays
    expect(result.current.faces).toEqual([]);
    expect(result.current.models).toEqual([]);

    // Add a face
    act(() => {
      result.current.addFace(mockFace);
    });

    expect(result.current.faces).toEqual([mockFace]);

    // Add the same face again - should not duplicate
    act(() => {
      result.current.addFace(mockFace);
    });

    expect(result.current.faces).toHaveLength(1);

    // Remove the face
    act(() => {
      result.current.removeFace(mockFace.name);
    });

    expect(result.current.faces).toEqual([]);
  });

  it("should add and remove models correctly", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SelectedImagesProvider>{children}</SelectedImagesProvider>
    );

    const { result } = renderHook(() => useSelectedImages(), { wrapper });

    // Add a model
    act(() => {
      result.current.addModel(mockModel);
    });

    expect(result.current.models).toEqual([mockModel]);

    // Add the same model again - should not duplicate
    act(() => {
      result.current.addModel(mockModel);
    });

    expect(result.current.models).toHaveLength(1);

    // Remove the model
    act(() => {
      result.current.removeModel(mockModel.name);
    });

    expect(result.current.models).toEqual([]);
  });

  it("should throw an error when used outside of provider", () => {
    // Silence console errors for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderHook(() => useSelectedImages());
    }).toThrow(
      "useSelectedImages must be used within a SelectedImagesProvider"
    );

    // Restore console.error
    console.error = originalError;
  });

  it("should handle upload functionality correctly", async () => {
    const mockUpload = jest.fn().mockResolvedValue("success");
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SelectedImagesProvider onUpload={mockUpload}>
        {children}
      </SelectedImagesProvider>
    );

    const { result } = renderHook(() => useSelectedImages(), { wrapper });

    // Add faces and models
    act(() => {
      result.current.addFace(mockFace);
      result.current.addModel(mockModel);
    });

    // Upload should be successful
    await act(async () => {
      await result.current.uploadSelection();
    });

    expect(mockUpload).toHaveBeenCalledWith(["Test Face"], ["Test Model"]);
    expect(result.current.uploadError).toBeNull();
    expect(result.current.isUploading).toBe(false);
  });

  it("should handle upload errors correctly", async () => {
    const mockUpload = jest.fn().mockRejectedValue(new Error("Upload failed"));
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SelectedImagesProvider onUpload={mockUpload}>
        {children}
      </SelectedImagesProvider>
    );

    const { result } = renderHook(() => useSelectedImages(), { wrapper });

    // Add faces and models
    act(() => {
      result.current.addFace(mockFace);
      result.current.addModel(mockModel);
    });

    // Upload should fail
    await act(async () => {
      await result.current.uploadSelection();
    });

    expect(result.current.uploadError).toBe("Upload failed");
    expect(result.current.isUploading).toBe(false);
  });

  it("should validate selection before upload", async () => {
    const mockUpload = jest.fn();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SelectedImagesProvider onUpload={mockUpload}>
        {children}
      </SelectedImagesProvider>
    );

    const { result } = renderHook(() => useSelectedImages(), { wrapper });

    // Try to upload without selection
    await act(async () => {
      await result.current.uploadSelection();
    });

    expect(mockUpload).not.toHaveBeenCalled();
    expect(result.current.uploadError).toBe(
      "Please select at least one face and one model"
    );
  });

  it("should clear all selections correctly", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SelectedImagesProvider>{children}</SelectedImagesProvider>
    );

    const { result } = renderHook(() => useSelectedImages(), { wrapper });

    // Add faces and models
    act(() => {
      result.current.addFace(mockFace);
      result.current.addModel(mockModel);
    });

    expect(result.current.faces).toHaveLength(1);
    expect(result.current.models).toHaveLength(1);

    // Clear all
    act(() => {
      result.current.clearAll();
    });

    expect(result.current.faces).toEqual([]);
    expect(result.current.models).toEqual([]);
    expect(result.current.uploadError).toBeNull();
  });
});

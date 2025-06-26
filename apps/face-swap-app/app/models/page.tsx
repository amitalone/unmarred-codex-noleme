"use client";
import { ImageGalleryPagePage } from "@repo/face-swap-ui/imageGalleryPage";
import { useState, useEffect } from "react";
import { getModels } from "../FaceSwapBFFClient";
import { type ModelImage } from "@repo/shared-interfaces";

export default function Page() {
  const [modelImages, setModelImages] = useState<ModelImage[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getModels("1");
        setModelImages(data as ModelImage[]);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  return (
    <>
      <ImageGalleryPagePage
        images={modelImages.length > 0 ? modelImages : []}
        title="models Gallery"
      />
    </>
  );
}

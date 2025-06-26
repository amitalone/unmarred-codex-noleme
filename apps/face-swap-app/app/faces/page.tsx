"use client";
import { ImageGalleryPagePage } from "@repo/face-swap-ui/imageGalleryPage";
import { useState, useEffect } from "react";
import { getFaces } from "../FaceSwapBFFClient";
import { type FaceImage } from "@repo/shared-interfaces";

export default function Page() {
  const [faceImages, setFaceImages] = useState<FaceImage[]>([]);

  useEffect(() => {
    const fetchFaces = async () => {
      try {
        const data = await getFaces("1");
        setFaceImages(data as FaceImage[]);
      } catch (error) {
        console.error("Error fetching faces:", error);
      }
    };

    fetchFaces();
  }, []);

  return (
    <>
      <ImageGalleryPagePage
        images={faceImages.length > 0 ? faceImages : []}
        title="models Gallery"
      />
    </>
  );
}

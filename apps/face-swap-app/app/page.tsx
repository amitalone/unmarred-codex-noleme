"use client";
import { OutputPage } from "@repo/face-swap-ui/outputPage";
import { useState, useEffect } from "react";
import { resultsByPathURL } from "./FaceSwapBFFClient";
import { type OutputImage } from "@repo/shared-interfaces";

export default function Page() {
  const [resultImages, setResultImages] = useState<OutputImage[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await resultsByPathURL("2025", "1");
        setResultImages(data as OutputImage[]);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchResults();
  }, []);

  return (
    <>
      <OutputPage
        images={resultImages.length > 0 ? resultImages : []}
        title="Results Gallery"
      />
    </>
  );
}

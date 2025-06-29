"use client";
import "./globals.css";
import { FaceSwapAppLayout } from "@repo/face-swap-ui/faceSwapAppLayout";
import Link from "next/link";
import { Geist } from "next/font/google";
import {
  IconImages,
  IconBodySwapping,
  IconFaceRetouchingNatural,
  IconFaceModelImport,
} from "@repo/design-system/icons";
const geist = Geist({ subsets: ["latin"] });
import { SelectedImagesProvider } from "@repo/face-swap-ui/selectedImagesContext";
import { submitImages, validateCombination } from "./FaceSwapBFFClient";
import { OutputImage } from "@repo/shared-interfaces";
const sideBarLinks = [
  {
    href: "/",
    icon: IconImages,
    label: "Home",
    linkComponent: <Link href="/">Home</Link>,
  },
  {
    href: "/faces",
    icon: IconFaceRetouchingNatural,
    label: "Faces",
    linkComponent: <Link href="/faces">Faces</Link>,
  },
  {
    href: "/models",
    icon: IconBodySwapping,
    label: "Models",
    linkComponent: <Link href="/models">Models</Link>,
  },
  {
    href: "/import",
    icon: IconFaceModelImport,
    label: "Import",
    linkComponent: <Link href="/import-files">Results</Link>,
  },
];

const handleUpload = async (faces: string[], models: string[]) => {
  return await submitImages(faces, models);
};

// Debounce utility function
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

// Create debounced version of validateCombination (500ms delay)
const debouncedValidateCombination = debounce(validateCombination, 500);

const handleImageAdded = async (
  faces: string[],
  models: string[]
): Promise<OutputImage[]> => {
  try {
    const result = await debouncedValidateCombination(faces, models);

    // Ensure we return an array of OutputImage
    if (Array.isArray(result)) {
      return result as OutputImage[];
    }

    // Handle different response structures if needed
    if (
      result &&
      typeof result === "object" &&
      "data" in result &&
      Array.isArray((result as any).data)
    ) {
      return (result as any).data as OutputImage[];
    }

    return [];
  } catch (error) {
    console.error("Error validating combinations:", error);
    return [];
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <SelectedImagesProvider onUpload={handleUpload}>
          <FaceSwapAppLayout
            sideBarLinks={sideBarLinks}
            onImageAdded={handleImageAdded}
          >
            {children}
          </FaceSwapAppLayout>
        </SelectedImagesProvider>
      </body>
    </html>
  );
}

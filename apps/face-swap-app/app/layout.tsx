"use client";
import "./globals.css";
import { FaceSwapAppLayout } from "@repo/face-swap-ui/faceSwapAppLayout";
import Link from "next/link";
import { Geist } from "next/font/google";
import {
  IconImages,
  IconBodySwapping,
  IconFaceRetouchingNatural,
} from "@repo/design-system/icons";
const geist = Geist({ subsets: ["latin"] });
import { SelectedImagesProvider } from "@repo/face-swap-ui/selectedImagesContext";
import { submitImages } from "./FaceSwapBFFClient";
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
];

const handleUpload = async (faces: string[], models: string[]) => {
  return await submitImages(faces, models);
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
          <FaceSwapAppLayout sideBarLinks={sideBarLinks}>
            {children}
          </FaceSwapAppLayout>
        </SelectedImagesProvider>
      </body>
    </html>
  );
}

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <FaceSwapAppLayout sideBarLinks={sideBarLinks}>
          {children}
        </FaceSwapAppLayout>
      </body>
    </html>
  );
}

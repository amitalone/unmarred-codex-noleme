"use client";
import "./globals.css";
import { BaseLayout } from "@repo/base-ui/baseLayout";
import { SideBarLayout } from "@repo/base-ui/sideBarLayout";
import { FaceSwapAppLayout } from "@repo/face-swap-ui/faceSwapAppLayout";
import {
  IconImages,
  IconBodySwapping,
  IconFaceRetouchingNatural,
} from "@repo/design-system/icons";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
const geist = Geist({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Welcome to The Unmarred Codex of Nólemë!",
//   description: "Quality and the Wisdom, contained within!",
// };

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

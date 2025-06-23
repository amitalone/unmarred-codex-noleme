"use client";
import "./globals.css";
import { BaseLayout } from "@repo/base-ui/baseLayout";
import { SideBarLayout } from "@repo/base-ui/sideBarLayout";
import { FaceSwapAppLayout } from "@repo/face-swap-ui/faceSwapAppLayout";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Welcome to The Unmarred Codex of Nólemë!",
//   description: "Quality and the Wisdom, contained within!",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <FaceSwapAppLayout>{children}</FaceSwapAppLayout>
      </body>
    </html>
  );
}

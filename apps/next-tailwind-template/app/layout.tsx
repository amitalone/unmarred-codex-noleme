"use client";
import "./globals.css";
import { BaseLayout } from "@repo/base-ui/baseLayout";
import { SideBarLayout } from "@repo/base-ui/sideBarLayout";
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
        {/* Comment out the BaseLayout temporarily */}
        {/* <BaseLayout
          leftColumn={<div className=" bg-red-800">L</div>}
          middleColumn={<div className="">{children}</div>}
          rightColumn={<div className=" bg-red-800">Right</div>}
        /> */}

        {/* Use SideBarLayout with explicit content */}
        <SideBarLayout>{children}</SideBarLayout>
      </body>
    </html>
  );
}

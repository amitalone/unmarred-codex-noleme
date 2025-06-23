import "./globals.css";
import { BaseLayout } from "@repo/base-ui/baseLayout";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to The Unmarred Codex of Nólemë!",
  description: "Quality and the Wisdom, contained within!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <BaseLayout
          leftColumn={<div className=" bg-red-800">L</div>}
          middleColumn={<div className="">{children}</div>}
          rightColumn={<div className=" bg-red-800">Right</div>}
        />
      </body>
    </html>
  );
}

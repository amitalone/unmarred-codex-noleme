import { type ReactNode } from "react";
import { FixedHeightContainer } from "@repo/base-ui/fixedHeightContainer";
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";
import { type BaseImage } from "@repo/base-ui/types";
import { FaceSwapAppPage } from "../faceSwapAppPage";

export interface OutputPageProps {
  images: BaseImage[];
  title?: string;
  className?: string;
}

export function OutputPage({
  images,
  title = "Output",
  className = "",
}: OutputPageProps) {
  return (
    <FaceSwapAppPage title={title} className={className}>
      <FixedHeightContainer height="85vh">
        <MasonryImageGrid images={images} />
      </FixedHeightContainer>
    </FaceSwapAppPage>
  );
}

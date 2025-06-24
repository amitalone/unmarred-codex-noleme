import { type ReactNode } from "react";
import { FixedHeightContainer } from "@repo/base-ui/fixedHeightContainer";
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";
import { type BaseImage } from "@repo/base-ui/types";
import { FaceSwapAppPage } from "../faceSwapAppPage";
import {
  SelectButton,
  DeleteButton,
  BookmarkButton,
  ResultsButton,
} from "./imageGalleryPageActionButtons";

export interface imageGalleryPageProps {
  images: BaseImage[];
  title?: string;
  className?: string;
}

export function ImageGalleryPagePage({
  images,
  title,
  className = "",
}: imageGalleryPageProps) {
  const faceImageActionButtonList: ReactNode[] = [
    SelectButton,
    ResultsButton,
    DeleteButton,
    BookmarkButton,
  ];

  return (
    <FaceSwapAppPage title={title || ""} className={className}>
      <FixedHeightContainer height="85vh">
        <MasonryImageGrid
          images={images}
          actionButtonList={faceImageActionButtonList}
        />
      </FixedHeightContainer>
    </FaceSwapAppPage>
  );
}

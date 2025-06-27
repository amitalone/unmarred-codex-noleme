import { type ReactNode } from "react";
import { FixedHeightContainer } from "@repo/base-ui/fixedHeightContainer";
import { FaceSwapAppPage } from "../faceSwapAppPage";
import {
  SelectButton,
  DeleteButton,
  BookmarkButton,
  ResultsButton,
} from "./imageGalleryPageActionButtons";
import { ImageGridWithFullScreen } from "@repo/base-ui/imageGridWithFullScreen";
import { BaseImage } from "@repo/shared-interfaces";

export interface imageGalleryPageProps {
  images: BaseImage[];
  title?: string;
  className?: string;
  children?: ReactNode; // Added to support loader component
}

export function ImageGalleryPagePage({
  images,
  title,
  className = "",
  children,
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
        <ImageGridWithFullScreen
          images={images}
          actionButtonList={faceImageActionButtonList}
        />
        {/* Render loader at the bottom */}
        {children && <div className="mt-4">{children}</div>}
      </FixedHeightContainer>
    </FaceSwapAppPage>
  );
}

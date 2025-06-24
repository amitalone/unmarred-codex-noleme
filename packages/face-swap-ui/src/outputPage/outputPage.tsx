import React, { type ReactNode, useCallback, useState, useEffect } from "react";
import { FixedHeightContainer } from "@repo/base-ui/fixedHeightContainer";
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";
import { type BaseImage } from "@repo/base-ui/types";
import { FaceSwapAppPage } from "../faceSwapAppPage";
import { IconButton } from "@repo/base-ui/iconButton";
import { ImageButton } from "@repo/base-ui/imageButton";
import { IconDelete, IconBookmark } from "@repo/design-system/icons";
import { ButtonNames, buttonActionHandler } from "./outputPage.event.handler";
import { type OutputImage } from "../types";

export interface OutputPageProps {
  images: BaseImage[];
  title?: string;
  className?: string;
}

const FaceButton = ({ payload }: { payload?: OutputImage }) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    if (payload?.face?.src) {
      setSrc(payload.face.src);
    }
  }, [payload]);

  return (
    <ImageButton
      key="face"
      src={src}
      alt="Face image"
      data-testid="face-image-button"
      payload={payload}
      onClick={(e: React.MouseEvent<Element>, props) => {
        const outputImage = props?.payload as OutputImage;
        buttonActionHandler(ButtonNames.FACE_IMAGE, outputImage);
      }}
    />
  );
};

const ModelButton = ({ payload }: { payload?: OutputImage }) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    if (payload?.model?.src) {
      setSrc(payload.model.src);
    }
  }, [payload]);

  return (
    <ImageButton
      key="model"
      src={src}
      alt="Model image"
      data-testid="model-image-button"
      payload={payload}
      onClick={(e: React.MouseEvent<Element>, props) => {
        const outputImage = props?.payload as OutputImage;
        buttonActionHandler(ButtonNames.MODEL_IMAGE, outputImage);
      }}
    />
  );
};

export function OutputPage({
  images,
  title = "Output",
  className = "",
}: OutputPageProps) {
  // Create default action buttons
  const outputImageActionButtonList: ReactNode[] = [
    <IconButton
      key="delete"
      reactIcon={IconDelete}
      textColor="text-white"
      shadowClass="shadow-md"
      data-testid="delete-button"
      onClick={(e: React.MouseEvent<Element>, props) => {
        const outputImage = props?.payload as OutputImage;
        buttonActionHandler(ButtonNames.DELETE, outputImage);
      }}
    />,
    <IconButton
      key="bookmark"
      reactIcon={IconBookmark}
      textColor="text-white"
      shadowClass="shadow-md"
      data-testid="bookmark-button"
      onClick={(e: React.MouseEvent<Element>, props) => {
        const outputImage = props?.payload as OutputImage;
        buttonActionHandler(ButtonNames.BOOKMARK, outputImage);
      }}
    />,
    <FaceButton key="face" payload={undefined} />,
    <ModelButton key="model" payload={undefined} />,
  ];

  return (
    <FaceSwapAppPage title={title} className={className}>
      <FixedHeightContainer height="85vh">
        {" "}
        <MasonryImageGrid
          images={images}
          actionButtonList={outputImageActionButtonList}
        />
      </FixedHeightContainer>
    </FaceSwapAppPage>
  );
}

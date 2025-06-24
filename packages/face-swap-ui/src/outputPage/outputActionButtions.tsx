import React, { type ReactNode, useCallback, useState, useEffect } from "react";
import { type OutputImage } from "../types";
import { ImageButton } from "@repo/base-ui/imageButton";
import { ButtonNames, buttonActionHandler } from "./outputPage.event.handler";
import { IconButton } from "@repo/base-ui/iconButton";
import { IconDelete, IconBookmark } from "@repo/design-system/icons";

export const FaceButton = ({ payload }: { payload?: OutputImage }) => {
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

export const ModelButton = ({ payload }: { payload?: OutputImage }) => {
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

export const DeleteButton = (
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
  />
);

export const BookmarkButton = (
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
  />
);

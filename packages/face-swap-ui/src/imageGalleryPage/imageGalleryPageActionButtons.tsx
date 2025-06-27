import React, { type ReactNode, useCallback, useState, useEffect } from "react";
import { type FaceImage, type ModelImage } from "@repo/shared-interfaces";
import {
  ButtonNames,
  createButtonActionHandler,
  type SelectedImagesActions,
} from "./imageGalleryPage.event.handler";
import { IconButton } from "@repo/base-ui/iconButton";
import {
  IconDelete,
  IconBookmark,
  IconFaceRetouchingNatural,
  IconSwapOutput,
  IconSelect,
} from "@repo/design-system/icons";
import { useSelectedImages } from "@repo/face-swap-ui/selectedImagesContext";

export function ImageGalleryPageActionButtons() {
  // Use the hook inside a component
  const selectedImagesActions = useSelectedImages();
  // Create the handler with the actions
  const buttonActionHandler = createButtonActionHandler(selectedImagesActions);

  const ResultsButton = (
    <IconButton
      key="results"
      reactIcon={IconSwapOutput}
      textColor="text-white"
      shadowClass="shadow-md"
      data-testid="results-button"
      onClick={(e: React.MouseEvent<Element>, props) => {
        const image = props?.payload;
        buttonActionHandler(ButtonNames.RESULTS, image);
      }}
    />
  );

  const SelectButton = (
    <IconButton
      key="select"
      reactIcon={IconSelect}
      textColor="text-white"
      shadowClass="shadow-md"
      data-testid="select-button"
      onClick={(e: React.MouseEvent<Element>, props) => {
        const image = props?.payload;
        buttonActionHandler(ButtonNames.SELECT, image);
      }}
    />
  );

  const DeleteButton = (
    <IconButton
      key="delete"
      reactIcon={IconDelete}
      textColor="text-white"
      shadowClass="shadow-md"
      data-testid="delete-button"
      onClick={(e: React.MouseEvent<Element>, props) => {
        const image = props?.payload;
        buttonActionHandler(ButtonNames.DELETE, image);
      }}
    />
  );

  const BookmarkButton = (
    <IconButton
      key="bookmark"
      reactIcon={IconBookmark}
      textColor="text-white"
      shadowClass="shadow-md"
      data-testid="bookmark-button"
      onClick={(e: React.MouseEvent<Element>, props) => {
        const image = props?.payload;
        buttonActionHandler(ButtonNames.BOOKMARK, image);
      }}
    />
  );

  return {
    ResultsButton,
    SelectButton,
    DeleteButton,
    BookmarkButton,
  };
}

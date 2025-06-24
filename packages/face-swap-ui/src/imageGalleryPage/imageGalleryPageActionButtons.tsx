import React, { type ReactNode, useCallback, useState, useEffect } from "react";
import { type FaceImage } from "../types";
import {
  ButtonNames,
  buttonActionHandler,
} from "./imageGalleryPage.event.handler";
import { IconButton } from "@repo/base-ui/iconButton";
import {
  IconDelete,
  IconBookmark,
  IconFaceRetouchingNatural,
  IconSwapOutput,
  IconSelect,
} from "@repo/design-system/icons";

export const ResultsButton = (
  <IconButton
    key="delete"
    reactIcon={IconSwapOutput}
    textColor="text-white"
    shadowClass="shadow-md"
    data-testid="delete-button"
    onClick={(e: React.MouseEvent<Element>, props) => {
      const faceImage = props?.payload as FaceImage;
      buttonActionHandler(ButtonNames.RESULTS, faceImage);
    }}
  />
);

export const SelectButton = (
  <IconButton
    key="delete"
    reactIcon={IconSelect}
    textColor="text-white"
    shadowClass="shadow-md"
    data-testid="delete-button"
    onClick={(e: React.MouseEvent<Element>, props) => {
      const faceImage = props?.payload as FaceImage;
      buttonActionHandler(ButtonNames.SELECT, faceImage);
    }}
  />
);

export const DeleteButton = (
  <IconButton
    key="delete"
    reactIcon={IconDelete}
    textColor="text-white"
    shadowClass="shadow-md"
    data-testid="delete-button"
    onClick={(e: React.MouseEvent<Element>, props) => {
      const faceImage = props?.payload as FaceImage;
      buttonActionHandler(ButtonNames.DELETE, faceImage);
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
      const faceImage = props?.payload as FaceImage;
      buttonActionHandler(ButtonNames.BOOKMARK, faceImage);
    }}
  />
);

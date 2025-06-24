import { type ReactNode } from "react";
import { FixedHeightContainer } from "@repo/base-ui/fixedHeightContainer";
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";
import { type BaseImage } from "@repo/base-ui/types";
import { FaceSwapAppPage } from "../faceSwapAppPage";
import { IconButton } from "@repo/base-ui/iconButton";
import { ImageButton } from "@repo/base-ui/imageButton";
import { IconDelete, IconBookmark } from "@repo/design-system/icons";

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
  const actionButtonList: ReactNode[] = [
    <IconButton
      reactIcon={IconDelete}
      textColor="text-white"
      shadowClass="shadow-md"
      data-testid="delete-button"
    />,
    <IconButton
      reactIcon={IconBookmark}
      textColor="text-white"
      shadowClass="shadow-md"
      data-testid="bookmark-button"
    />,
    <ImageButton
      src="https://flowbite-react.com/images/people/profile-picture-5.jpg"
      alt="Description of the image"
      onClick={() => {}}
      data-testid="image-button"
    />,
    <ImageButton
      src="https://flowbite-react.com/images/people/profile-picture-5.jpg"
      alt="Description of the image"
      onClick={() => {}}
      data-testid="image-button"
      rounded={false}
    />,
  ];

  return (
    <FaceSwapAppPage title={title} className={className}>
      <FixedHeightContainer height="85vh">
        <MasonryImageGrid images={images} actionButtonList={actionButtonList} />
      </FixedHeightContainer>
    </FaceSwapAppPage>
  );
}

import { type ReactNode } from "react";
import { FixedHeightContainer } from "@repo/base-ui/fixedHeightContainer";
import { MasonryImageGrid } from "@repo/base-ui/masonryImageGrid";
import { type BaseImage } from "@repo/base-ui/types";
import { FaceSwapAppPage } from "../faceSwapAppPage";
import { Popover } from "@repo/design-system/popover";
import {
  FaceButton,
  ModelButton,
  DeleteButton,
  BookmarkButton,
} from "./outputActionButtions";

export interface OutputPageProps {
  images: BaseImage[];
  title?: string;
  className?: string;
  children?: ReactNode; // Added to support loader component
}

export function OutputPage({
  images,
  title = "Output",
  className = "",
  children,
}: OutputPageProps) {
  // Create default action buttons
  const outputImageActionButtonList: ReactNode[] = [
    DeleteButton,
    BookmarkButton,
    <FaceButton key="face" payload={undefined} />,
    <ModelButton key="model" payload={undefined} />,
  ];

  return (
    <FaceSwapAppPage title={title} className={className}>
      <FixedHeightContainer height="85vh">
        <Popover
          trigger="hover"
          className="z-1000"
          content={
            <div className="w-32 ">
              <img
                src="https://flowbite.com/docs/images/popovers/italy.png"
                className="col-span-2 h-auto "
                alt="Italy map"
              />
            </div>
          }
        >
          <a
            href="#"
            className="text-blue-600 underline hover:no-underline dark:text-blue-500"
          >
            Italy
          </a>
        </Popover>
        <MasonryImageGrid
          images={images}
          actionButtonList={outputImageActionButtonList}
        />
        {/* Render loader at the bottom */}
        {children && <div className="mt-4">{children}</div>}
      </FixedHeightContainer>
    </FaceSwapAppPage>
  );
}

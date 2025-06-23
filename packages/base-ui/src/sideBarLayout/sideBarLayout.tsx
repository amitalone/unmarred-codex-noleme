"use client";
import { type ReactNode, useState } from "react";
import { BaseLayout } from "../baseLayout";
import { IconMenu } from "@repo/design-system/icons";
import { Drawer } from "@repo/design-system/drawer";

type SideBarLayoutProps = {
  children: ReactNode;
  className?: string;
};

export function SideBarLayout({
  children,
  className = "",
}: SideBarLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const leftContent = (
    <div
      className="sidebar-layout__left-content"
      data-testid="sidebar-layout-left-content"
    >
      <span onClick={toggleDrawer}>
        <IconMenu />
      </span>
    </div>
  );

  const rightContent = (
    <div
      className="sidebar-layout__right-content"
      data-testid="sidebar-layout-right-content"
    >
      Hello
    </div>
  );

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        placement="left"
        title="AppTitle"
      >
        <div className="drawer-content">
          <p>Drawer content goes here</p>
        </div>
      </Drawer>
      <BaseLayout
        leftColumn={leftContent}
        middleColumn={children}
        rightColumn={rightContent}
        className={`sidebar-layout ${className}`}
        data-testid="sidebar-layout"
      />
    </>
  );
}

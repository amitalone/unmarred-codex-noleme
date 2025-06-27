"use client";
import { type ReactNode, useState } from "react";
import { BaseLayout } from "../baseLayout";
import { IconMenu } from "@repo/design-system/icons";
import { Drawer } from "@repo/design-system/drawer";

type SideBarLayoutProps = {
  children: ReactNode;
  className?: string;
  drawerItem: ReactNode;
  leftSidebar?: ReactNode;
};

export function SideBarLayout({
  children,
  className = "",
  drawerItem,
  leftSidebar,
}: SideBarLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      {""}
    </div>
  );

  return (
    <>
      {" "}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position="left"
        title="Face-Swap"
        className="face-swap-drawer"
      >
        {drawerItem}
      </Drawer>
      <BaseLayout
        leftColumn={leftContent}
        middleColumn={children}
        // rightColumn={rightContent}
        className={`sidebar-layout ${className}`}
        data-testid="sidebar-layout"
      />
    </>
  );
}

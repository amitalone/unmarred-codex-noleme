"use client";
import {
  Sidebar as FlowSidebar,
  SidebarItems,
  SidebarItemGroup,
} from "flowbite-react";
import { ReactNode } from "react";

export interface SidebarProps {
  children: ReactNode;
  className?: string;
  collapsed?: boolean;
  aria?: string;
  logo?: ReactNode;
}

export function Sidebar({
  children,
  className = "",
  collapsed = false,
  aria = "Navigation sidebar",
  logo,
}: SidebarProps) {
  return (
    <FlowSidebar aria-label={aria} className={className} collapsed={collapsed}>
      {logo}
      <SidebarItems>
        <SidebarItemGroup>{children}</SidebarItemGroup>
      </SidebarItems>
    </FlowSidebar>
  );
}

/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { SideBarLayout } from "./sideBarLayout";
import { IconMenu } from "@repo/design-system/icons";

// Mock necessary components
jest.mock("@repo/design-system/icons", () => ({
  IconMenu: () => <div data-testid="icon-menu">MenuIcon</div>,
}));

jest.mock("@repo/design-system/drawer", () => ({
  Drawer: ({
    children,
    open,
    onClose,
  }: {
    children: React.ReactNode;
    open: boolean;
    onClose: () => void;
    placement?: string;
    title?: string;
    className?: string;
  }) => (
    <div data-testid="mock-drawer" data-open={open}>
      {children}
    </div>
  ),
}));

// Mock React 19 features to be compatible with testing-library
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    // Add any React 19 specific features that need mocking
  };
});

describe("SideBarLayout Component", () => {
  const drawerContent = <div>Drawer Content</div>;

  it("renders the left content with menu icon", () => {
    render(
      <SideBarLayout drawerItem={drawerContent}>Middle Content</SideBarLayout>
    );

    const leftContent = screen.getByTestId("sidebar-layout-left-content");
    expect(leftContent).toBeInTheDocument();
    expect(screen.getByTestId("icon-menu")).toBeInTheDocument();
  });

  it("renders the children in the middle column", () => {
    render(
      <SideBarLayout drawerItem={drawerContent}>Middle Content</SideBarLayout>
    );

    expect(screen.getByText("Middle Content")).toBeInTheDocument();
  });

  it("renders the right content", () => {
    render(
      <SideBarLayout drawerItem={drawerContent}>Middle Content</SideBarLayout>
    );

    const rightContent = screen.getByTestId("sidebar-layout-right-content");
    expect(rightContent).toBeInTheDocument();
    expect(rightContent.textContent).toBe("");
  });
  it("applies custom className", () => {
    render(
      <SideBarLayout drawerItem={drawerContent} className="test-class">
        Middle Content
      </SideBarLayout>
    );

    const baseLayoutElement = screen.getByTestId("base-layout");
    expect(baseLayoutElement).toHaveClass("sidebar-layout");
    expect(baseLayoutElement).toHaveClass("test-class");
  });
  it("renders the drawer when toggled", () => {
    const { rerender } = render(
      <SideBarLayout drawerItem={drawerContent}>Middle Content</SideBarLayout>
    );

    // Verify drawer is initially closed
    expect(screen.getByTestId("mock-drawer")).toHaveAttribute(
      "data-open",
      "false"
    );

    // Toggle drawer by clicking on menu icon
    const menuIcon = screen.getByTestId("icon-menu");
    menuIcon.parentElement?.click();

    // Force a re-render to capture state updates
    rerender(
      <SideBarLayout drawerItem={drawerContent}>Middle Content</SideBarLayout>
    );

    // Verify drawer is now open
    expect(screen.getByTestId("mock-drawer")).toHaveAttribute(
      "data-open",
      "true"
    );
  });
});

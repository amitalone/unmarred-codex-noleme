/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { FaceSwapSidebar, type SideBarLink } from "./faceSwapSidebar";
import { Sidebar, SidebarItem } from "@repo/design-system/sidebar";

// Mock the design system components
jest.mock("@repo/design-system/sidebar", () => ({
  Sidebar: jest.fn(({ children, className, aria }) => (
    <div data-testid="sidebar" className={className} aria-label={aria}>
      {children}
    </div>
  )),
  SidebarItem: jest.fn(({ children, icon, href }) => (
    <div data-testid="sidebar-item" data-href={href}>
      {icon && <span data-testid="icon">{React.createElement(icon)}</span>}
      {children}
    </div>
  )),
}));

// Mock the icons
jest.mock("@repo/design-system/icons", () => ({
  IconImages: function IconImages() {
    return <div>IconImages</div>;
  },
  IconBodySwapping: function IconBodySwapping() {
    return <div>IconBodySwapping</div>;
  },
  IconFaceRetouchingNatural: function IconFaceRetouchingNatural() {
    return <div>IconFaceRetouchingNatural</div>;
  },
}));

describe("FaceSwapSidebar Component", () => {
  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sidebar with default props", () => {
    render(<FaceSwapSidebar />);
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveClass("face-swap-sidebar");
    expect(sidebar).toHaveAttribute("aria-label", "Face Swap Navigation");

    // Should not render any sidebar items with empty links
    expect(screen.queryAllByTestId("sidebar-item")).toHaveLength(0);
  });

  it("applies custom className", () => {
    render(<FaceSwapSidebar className="custom-class" />);

    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toHaveClass("face-swap-sidebar");
    expect(sidebar).toHaveClass("custom-class");
  });
  it("renders sidebar items for each link", () => {
    const MockIcon = () => <div>MockIcon</div>;

    const sideBarLinks: SideBarLink[] = [
      {
        href: "/images",
        icon: MockIcon,
        label: "Images",
      },
      {
        href: "/face-swap",
        icon: MockIcon,
        label: "Face Swap",
      },
    ];

    render(<FaceSwapSidebar sideBarLinks={sideBarLinks} />);

    const sidebarItems = screen.getAllByTestId("sidebar-item");
    expect(sidebarItems).toHaveLength(2);

    // Check the first item
    expect(sidebarItems[0]).toHaveAttribute("data-href", "/images");
    expect(screen.getByText("Images")).toBeInTheDocument();

    // Check the second item
    expect(sidebarItems[1]).toHaveAttribute("data-href", "/face-swap");
    expect(screen.getByText("Face Swap")).toBeInTheDocument();
  });
  it("renders custom link component instead of label when provided", () => {
    const MockIcon = () => <div>MockIcon</div>;

    const CustomLink = () => <span>Custom Link Component</span>;

    const sideBarLinks: SideBarLink[] = [
      {
        href: "/images",
        icon: MockIcon,
        label: "Images",
      },
      {
        href: "/custom",
        icon: MockIcon,
        label: "Not Shown",
        linkComponent: <CustomLink />,
      },
    ];

    render(<FaceSwapSidebar sideBarLinks={sideBarLinks} />);

    expect(screen.getByText("Images")).toBeInTheDocument();
    expect(screen.getByText("Custom Link Component")).toBeInTheDocument();
    expect(screen.queryByText("Not Shown")).not.toBeInTheDocument();

    const sidebarItems = screen.getAllByTestId("sidebar-item");
    // The second item should not have href attribute since linkComponent is provided
    expect(sidebarItems[1]).not.toHaveAttribute("data-href", "/custom");
  });
});

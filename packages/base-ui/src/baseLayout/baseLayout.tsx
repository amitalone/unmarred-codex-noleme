import { type ReactNode } from "react";

type BaseLayoutProps = {
  leftColumn?: ReactNode;
  middleColumn: ReactNode;
  rightColumn?: ReactNode;
  className?: string;
};

export function BaseLayout({
  leftColumn,
  middleColumn,
  rightColumn,
  className = "",
}: BaseLayoutProps) {
  return (
    <div className={`base-layout ${className}`} data-testid="base-layout">
      <div
        className="base-layout__container"
        data-testid="base-layout-container"
      >
        {leftColumn && (
          <div
            className="base-layout__left-column"
            data-testid="base-layout-left-column"
          >
            {leftColumn}
          </div>
        )}
        <div
          className="base-layout__middle-column"
          data-testid="base-layout-middle-column"
        >
          {middleColumn}
        </div>
        {rightColumn && (
          <div
            className="base-layout__right-column"
            data-testid="base-layout-right-column"
          >
            {rightColumn}
          </div>
        )}
      </div>
    </div>
  );
}

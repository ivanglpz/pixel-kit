import { css } from "@stylespixelkit/css";
import { FolderOpen, Home, Plus, X } from "lucide-react";
import type { ReactNode } from "react";

export type ProjectTabItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  closable?: boolean;
};

export type ProjectTabsShellProps = {
  tabs: ProjectTabItem[];
  activeTabId?: string;
  onSelectTab: (id: string) => void;
  onCloseTab?: (id: string) => void;
  onCreateTab?: VoidFunction;
  onGoHome: VoidFunction;
  rightSlot?: ReactNode;
  className?: string;
};

const DEFAULT_TAB_ICON = <FolderOpen size={14} />;

export const ProjectTabsShell = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onCreateTab,
  onGoHome,
  rightSlot,
  className,
}: ProjectTabsShellProps) => {
  return (
    <header
      className={[
        "grid h-12 grid-cols-[33px_1fr_auto] items-center gap-4 border-b border-border bg-bg p-2",
        className ?? "",
      ].join(" ")}
    >
      <section className="flex flex-row items-center justify-center">
        <button
          type="button"
          onClick={onGoHome}
          className={css({
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "primary",
            padding: "5px",
            cursor: "pointer",
            borderRadius: "md",
          })}
          aria-label="Go home"
        >
          <Home size={18} />
        </button>
      </section>

      <div className="flex h-full w-full flex-row items-center justify-start gap-2 overflow-x-scroll overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => {
          const isSelected = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              title={tab.label}
              className={[
                "grid h-8 w-[200px] min-w-[140px] grid-cols-[16px_1fr_auto] items-center gap-2 rounded-md px-2 text-left",
                isSelected
                  ? "bg-gray-150 text-foreground dark:bg-neutral-800 dark:text-white"
                  : "text-foreground/80 hover:bg-gray-100 dark:text-white/80 dark:hover:bg-gray-800",
              ].join(" ")}
            >
              <span className="flex items-center justify-center">
                {tab.icon ?? DEFAULT_TAB_ICON}
              </span>
              <span className="truncate text-xs">{tab.label}</span>
              {tab.closable === false || !onCloseTab ? null : (
                <span className="flex items-center justify-center">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      onCloseTab(tab.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        onCloseTab(tab.id);
                      }
                    }}
                    aria-label={`Close ${tab.label}`}
                    className="flex h-4 w-4 items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10"
                  >
                    <X size={12} />
                  </span>
                </span>
              )}
            </button>
          );
        })}
        {!onCreateTab ? null : (
          <button
            type="button"
            onClick={onCreateTab}
            className={css({
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "lg",
            })}
            aria-label="Create project"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-end">{rightSlot ?? null}</div>
    </header>
  );
};

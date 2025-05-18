import { css } from "@stylespixelkit/css";
import { ReactNode, useState } from "react";

type Props = {
  title: string;
  children?: ReactNode;
  onDelete?: VoidFunction;
  onDeleteLabel?: string;
};

export const Section = ({
  title,
  children,
  onDelete,
  onDeleteLabel,
}: Props) => {
  return (
    <section
      className={css({
        padding: "md",
        display: "flex",
        flexDirection: "column",
        gap: "md",
        // backgroundColor: "primary",
        borderRadius: "lg",
        // border: "container",
      })}
    >
      <header
        className={css({
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "bold",
          })}
        >
          {title}
        </p>
        {onDelete ? (
          <button
            onClick={onDelete}
            className={css({
              padding: "md",
              cursor: "pointer",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "md",
            })}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 21C6.45 21 5.97933 20.8043 5.588 20.413C5.19667 20.0217 5.00067 19.5507 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8043 20.021 18.413 20.413C18.0217 20.805 17.5507 21.0007 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                fill="#bb2124"
              />
            </svg>
            {onDeleteLabel ? (
              <p
                className={css({
                  color: "#bb2124",
                  fontSize: "x-small",
                  fontWeight: "bold",
                })}
              >
                {onDeleteLabel}
              </p>
            ) : null}
          </button>
        ) : null}
      </header>
      {children}
    </section>
  );
};

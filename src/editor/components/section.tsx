import { css } from "@stylespixelkit/css";
import { ReactNode, useState } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export const Section = ({ title, children }: Props) => {
  const [show, setShow] = useState(true);
  return (
    <section
      className={css({
        padding: "md",
        display: "flex",
        flexDirection: "column",
        gap: "md",
        backgroundColor: "primary",
        borderRadius: "lg",
        border: "container",
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
        <svg
          width="17"
          height="10"
          viewBox="0 0 17 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            rotate: show ? "0deg" : "180deg",
            cursor: "pointer",
          }}
          onClick={() => setShow((prev) => !prev)}
        >
          <path
            d="M0.365983 9.20473C0.600393 9.43907 0.918278 9.57072 1.24973 9.57072C1.58119 9.57072 1.89907 9.43907 2.13348 9.20473L8.32098 3.01723L14.5085 9.20473C14.7442 9.43243 15.06 9.55842 15.3877 9.55558C15.7155 9.55273 16.029 9.42127 16.2608 9.18951C16.4925 8.95775 16.624 8.64423 16.6268 8.31648C16.6297 7.98874 16.5037 7.67299 16.276 7.43723L9.20473 0.365983C8.97032 0.131644 8.65244 0 8.32098 0C7.98953 0 7.67164 0.131644 7.43723 0.365983L0.365983 7.43723C0.131644 7.67164 0 7.98953 0 8.32098C0 8.65244 0.131644 8.97032 0.365983 9.20473Z"
            fill="white"
          />
        </svg>
      </header>
      {show ? children : null}
    </section>
  );
};

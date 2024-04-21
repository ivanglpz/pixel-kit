import { Valid } from "@/components/valid";
import { css } from "@stylespixelkit/css";
import { ReactNode } from "react";

type Props = {
  text?: string;
  onClick: () => void;
  isLoading?: boolean;
  children?: ReactNode;
  type?: "normal" | "danger" | "success";
  fullWidth?: boolean;
};

export const Button = ({
  onClick,
  text,
  isLoading = false,
  children,
  fullWidth = true,
  type = "normal",
}: Props) => {
  return (
    <button
      type="button"
      className={css({
        width: fullWidth ? "100%" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor:
          type === "danger"
            ? "danger"
            : type === "success"
              ? "success"
              : "secondary",
        borderRadius: "md",
        padding: "md",
        color: "text",
        textAlign: "center",
        fontSize: "x-small",
        fontWeight: "bold",
        _hover: {
          backgroundColor:
            type === "danger"
              ? "danger"
              : type === "success"
                ? "success"
                : "secondary",
          cursor: "pointer",
        },
      })}
      disabled={isLoading}
      onClick={onClick}
    >
      <Valid isValid={!isLoading}>{text ?? children}</Valid>
      <Valid isValid={isLoading}>
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </Valid>
    </button>
  );
};

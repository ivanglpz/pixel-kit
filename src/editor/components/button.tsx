import { Valid } from "@/components/valid";
import { css } from "@stylespixelkit/css";
import { ReactNode } from "react";

type Props = {
  text?: string;
  onClick: () => void;
  isLoading?: boolean;
  children?: ReactNode;
  type?: "normal" | "danger" | "success" | "dangerfill";
  fullWidth?: boolean;
};

const stylesType = {
  normal: "rgb(0, 153, 255)",
  danger: "#bb2124",
  success: "#5cb85c",
  dangerfill: "#bb2124",
};

const defaultStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderStyle: "solid",
  borderRadius: "md",
  padding: "md",
  color: "text",
  textAlign: "center",
  fontSize: "x-small",

  fontWeight: "bold",
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
        ...defaultStyles,
        width: fullWidth ? "100%" : "auto",
        _hover: {
          backgroundColor: stylesType[type],
          cursor: "pointer",
          opacity: 0.8,
        },
        _active: {
          backgroundColor: "primary",
          opacity: 1,
          scale: 0.95,
        },
      })}
      disabled={isLoading}
      style={{
        borderColor: stylesType[type],
        backgroundColor: stylesType[type],
      }}
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

import { css } from "@stylespixelkit/css";
import { ReactNode } from "react";
import { constants } from "../constants/color";

type ButtonProps = {
  onClick: VoidFunction;
  children: ReactNode;
};

const Primary = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      type="button"
      className={css({
        padding: "md",
        borderColor: "border",
        borderWidth: 1,
        borderRadius: "md",
        py: "5",
        px: "10",
        height: "35px",
        fontSize: "x-small",
        fontWeight: 700,
        color: "white",
        _dark: {
          color: "black",
        },
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "md",
      })}
      style={{
        backgroundColor: constants.theme.colors.primary,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
const Secondary = ({ onClick, children }: ButtonProps) => {
  return (
    <button
      type="button"
      className={css({
        padding: "md",
        borderColor: "gray.150",
        borderWidth: 1,
        borderRadius: "md",
        py: "5",
        px: "10",
        height: "35px",
        fontSize: "x-small",
        fontWeight: 700,
        _dark: {
          color: "white",
          borderColor: "gray.700",
        },
        color: "black",
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "md",
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export const Button = {
  Primary,
  Secondary,
};

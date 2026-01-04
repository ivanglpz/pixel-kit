import { css } from "@stylespixelkit/css";
import { CSSProperties, ReactNode } from "react";
import { constants } from "../constants/color";

type ButtonProps = {
  onClick: VoidFunction;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  style?: CSSProperties;
  disabled?: boolean;
};

const baseStyle = css({
  padding: "md",
  borderWidth: 1,
  borderRadius: "md",
  py: "5",
  px: "10",
  height: "35px",
  fontSize: "x-small",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: "sm",
});

const variantStyles = {
  primary: css({
    borderColor: "border",
    color: "white",
    _dark: { color: "black" },
  }),
  secondary: css({
    borderColor: "gray.150",
    color: "black",
    _dark: { color: "white", borderColor: "gray.500" },
  }),
  danger: css({
    borderColor: "red.500",
    color: "white",
    _dark: { color: "black" },
  }),
};

export const ButtonBase = ({
  onClick,
  children,
  variant = "primary",
  style: PropsStyle,
}: ButtonProps) => {
  const className = `${baseStyle} ${variantStyles[variant]}`;

  const style =
    variant === "primary"
      ? { backgroundColor: constants.theme.colors.primary }
      : (PropsStyle ?? {});

  return (
    <button type="button" className={className} style={style} onClick={onClick}>
      {children}
    </button>
  );
};

export const Button = {
  Primary: (props: Omit<ButtonProps, "variant">) => (
    <ButtonBase {...props} variant="primary" />
  ),
  Secondary: (props: Omit<ButtonProps, "variant">) => (
    <ButtonBase {...props} variant="secondary" />
  ),
  Danger: (props: Omit<ButtonProps, "variant">) => {
    const dangerStyle: CSSProperties = {
      backgroundColor: constants.theme.colors["red.400"],
      color: "white",
    };
    return <ButtonBase {...props} variant="danger" style={dangerStyle} />;
  },
};

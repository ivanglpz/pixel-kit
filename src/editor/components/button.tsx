import { css } from "@stylespixelkit/css";

type Props = {
  text: string;
  onClick: () => void;
};

export const Button = ({ onClick, text }: Props) => {
  return (
    <button
      type="button"
      className={css({
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "secondary",
        borderRadius: "md",
        padding: "md",
        color: "text",
        textAlign: "center",
        fontSize: "sm",
      })}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

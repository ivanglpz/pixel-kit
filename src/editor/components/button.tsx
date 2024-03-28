import { Valid } from "@/components/valid";
import { css } from "@stylespixelkit/css";

type Props = {
  text: string;
  onClick: () => void;
  isLoading?: boolean;
};

export const Button = ({ onClick, text, isLoading = false }: Props) => {
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
      disabled={isLoading}
      onClick={onClick}
    >
      <Valid isValid={!isLoading}>{text}</Valid>
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

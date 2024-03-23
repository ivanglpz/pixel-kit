import { css } from "@stylespixelkit/css";

type Props = {
  text: string;
  value: boolean;
  onCheck: (value: boolean) => void;
};

export const InputCheckbox = ({ text, value, onCheck }: Props) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "row",
        gap: "lg",
        height: "100%",
      })}
    >
      <input
        type="checkbox"
        id={text}
        name="scales"
        checked={value}
        onChange={() => onCheck(!value)}
      />
      <label
        htmlFor={text}
        className={css({
          color: "text",
          fontSize: "sm",
          fontWeight: "normal",
        })}
      >
        {text}
      </label>
    </div>
  );
};

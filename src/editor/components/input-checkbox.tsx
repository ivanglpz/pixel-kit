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
        alignItems: "center",
        gap: "lg",
        height: "100%",
      })}
    >
      <label className="switch">
        <input
          name="scales"
          id={text}
          type="checkbox"
          checked={value}
          onChange={() => onCheck(!value)}
        />
        <span className="slider round"></span>
      </label>
      <label htmlFor={text}>
        <p
          className={css({
            color: "text",
            fontSize: "sm",
            fontWeight: "normal",
          })}
        >
          {text}
        </p>
      </label>
    </div>
  );
};

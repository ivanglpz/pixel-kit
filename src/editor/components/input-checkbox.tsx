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
        justifyContent: "space-between",
        gap: "lg",
        height: "100%",
      })}
    >
      {text ? (
        <label
          htmlFor={text}
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "x-small",
          })}
        >
          {text}
        </label>
      ) : null}
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
    </div>
  );
};

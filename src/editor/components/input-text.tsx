import { css } from "@stylespixelkit/css";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const InputText = ({ onChange, value }: Props) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={css({
        width: "auto",
        border: "container",
        backgroundColor: "transparent",
        color: "text",
        padding: "sm",
        height: "30px",
        borderRadius: "md",
        fontSize: "sm",
      })}
    />
  );
};

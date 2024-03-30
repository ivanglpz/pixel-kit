import { Valid } from "@/components/valid";
import { css } from "@stylespixelkit/css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  labelText?: string;
};

export const InputText = ({ onChange, value, labelText }: Props) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "md",
      })}
    >
      <Valid isValid={Boolean(labelText?.length)}>
        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "normal",
            opacity: 0.7,
          })}
        >
          {labelText}
        </p>
      </Valid>
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
    </div>
  );
};

import { Valid } from "@/components/valid";
import { css } from "@stylespixelkit/css";

type Props = {
  value: string;
  onChange: (value: string) => void;
  labelText?: string;
  disable?: boolean;
};

export const InputTextArea = ({
  onChange,
  value,
  labelText,
  disable = false,
}: Props) => {
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
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disable}
        className={css({
          width: "100%",
          minHeight: "80px",
          border: "container",
          backgroundColor: "transparent",
          color: "text",
          padding: "sm",
          borderRadius: "md",
          fontSize: "sm",
          resize: "vertical", // permite ajustar el tamaño vertical
        })}
      />
    </div>
  );
};

import { Valid } from "@/components/valid";
import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { PAUSE_MODE_ATOM } from "../states/tool";

type Props = {
  value: string;
  onChange: (value: string) => void;
  labelText?: string;
  disable?: boolean;
};

export const InputText = ({
  onChange,
  value,
  labelText,
  disable = false,
}: Props) => {
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

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
        disabled={disable}
        onClick={() => setPause(true)}
        onBlur={() => setPause(false)}
        onMouseLeave={() => setPause(false)}
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

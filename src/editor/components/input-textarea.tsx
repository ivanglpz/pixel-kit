import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { PAUSE_MODE_ATOM } from "../states/tool";

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
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  return (
    <div
      className={css({
        width: "100%",
        color: "text",
        fontSize: "sm",
        backgroundColor: "gray.900", // Fondo más claro para el selector
        borderRadius: "md",
        padding: "sm",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "gray.700", // ← usa el semantic token
        gap: "md",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disable}
        onFocus={() => setPause(true)} // Inicia pausa al entrar en el input
        onBlur={() => setPause(false)} // Quita pausa al salir del input
        className={css({
          width: "100%",
          minHeight: "80px",
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

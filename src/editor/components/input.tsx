import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { CSSProperties, ReactNode } from "react";
import { PAUSE_MODE_ATOM } from "../states/tool";

const Label = ({ text }: { text: string }) => {
  return (
    <p
      className={css({
        color: "text",
        fontWeight: "600",
        fontSize: "x-small",
      })}
    >
      {text}
    </p>
  );
};

const GridComponent = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "20px 1fr",
        alignItems: "center",
        justifyContent: "center",
        alignContent: "center",
        gap: "md",
      })}
    >
      {children}
    </div>
  );
};
const Container = ({ children, id }: { children: ReactNode; id?: string }) => {
  if (id) {
    return (
      <label
        htmlFor={id}
        className={css({
          width: "100%",
          color: "text",
          fontSize: "sm",
          _dark: {
            borderColor: "gray.700", // ← usa el semantic token
            backgroundColor: "gray.800", // Fondo más claro para el selector
          },
          backgroundColor: "gray.100",
          borderColor: "gray.200", // ← usa el semantic token
          borderRadius: "md",
          padding: "sm",
          borderWidth: "1px",
          borderStyle: "solid",
          gap: "md",
          minHeight: 30,
        })}
      >
        {children}
      </label>
    );
  }
  return (
    <div
      className={css({
        width: "100%",
        color: "text",
        fontSize: "sm",
        _dark: {
          borderColor: "gray.700", // ← usa el semantic token
          backgroundColor: "gray.800", // Fondo más claro para el selector
        },
        backgroundColor: "gray.100",
        borderColor: "gray.200", // ← usa el semantic token

        borderRadius: "md",
        padding: "sm",
        borderWidth: "1px",
        borderStyle: "solid",
        gap: "md",
        minHeight: 30,
      })}
    >
      {children}
    </div>
  );
};
const IconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={css({
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        backgroundColor: "gray.150",

        _dark: {
          backgroundColor: "gray.700",
        },
      })}
    >
      {children}
    </div>
  );
};

type InputNumberProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};
const NumberComponent = ({
  onChange,
  value,
  max,
  min,
  step,
}: InputNumberProps) => {
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };
  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleNumberChange}
      onFocus={() => setPause(true)} // Inicia pausa al entrar en el input
      onBlur={() => setPause(false)} // Quita pausa al salir del input
      className={css({
        color: "text",
        backgroundColor: "transparent",
        flex: 1,
        outline: "none",
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis", // Añade los puntos suspensivos
        width: "100%",
        padding: "0 4px",
        fontSize: "x-small",
      })}
    />
  );
};

type InputTextProps = {
  value: string;
  onChange: (value: string) => void;
  style?: CSSProperties;
  placeholder?: string;
};

const TextComponent = ({ onChange, value, style }: InputTextProps) => {
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={() => setPause(true)} // Inicia pausa al entrar en el input
      onBlur={() => setPause(false)} // Quita pausa al salir del input
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
      style={style}
    />
  );
};

export const TextArea = ({
  onChange,
  value,
  style,
  placeholder,
}: InputTextProps) => {
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={() => setPause(true)} // Inicia pausa al entrar en el input
      onBlur={() => setPause(false)} // Quita pausa al salir del input
      placeholder={placeholder}
      className={css({
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        color: "text",
        padding: "sm",
        borderRadius: "md",
        fontSize: "sm",
        resize: "vertical", // permite ajustar el tamaño vertical
      })}
      style={style}
    />
  );
};

type Props = {
  value: string;
  options: {
    id: string | number;
    label: string;
    value: string;
  }[];
  onChange: (value: string) => void;
};

const Select = ({ options, value, onChange }: Props) => {
  return (
    <select
      value={value}
      className={css({
        width: "100%",
        color: "text",
        fontSize: "sm",
        backgroundColor: "transparent",
      })}
      onChange={(event) => onChange(event.target.value)}
    >
      {options?.map((e) => (
        <option key={e.id} value={e.value}>
          {e.label}
        </option>
      ))}
    </select>
  );
};

const ColorComponent = ({
  onChange,
  value,
  id,
}: InputTextProps & { id: string }) => {
  return (
    <>
      <div
        className={css({
          height: "20px",
          width: "20px",
          borderRadius: "md",
          border: "container",
          display: "flex",
          padding: "sm",
          cursor: "pointer",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "border.muted", // ← usa el semantic token
          alignItems: "center",
          justifyContent: "center",
        })}
        style={{
          backgroundColor: value ?? "#ffffff",
        }}
      >
        <input
          type="color"
          id={id}
          className={css({
            margin: 0,
            outline: "none",
            padding: 0,
            border: "none",
            opacity: 0,
            height: 0,
            width: 0,
          })}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </>
  );
};

export const Input = {
  Grid: GridComponent,
  Container,
  Label,
  Number: NumberComponent,
  Text: TextComponent,
  Color: ColorComponent,
  IconContainer,
  TextArea,
  Select,
};

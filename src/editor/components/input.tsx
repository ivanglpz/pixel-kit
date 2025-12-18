import { css } from "@stylespixelkit/css";
import { SetStateAction, useAtom, useSetAtom } from "jotai";
import React, {
  CSSProperties,
  FocusEvent,
  ReactElement,
  ReactNode,
} from "react";
import { ShapeBase } from "../shapes/types/shape.base";
import { ShapeState } from "../shapes/types/shape.state";
import { useShapeUpdate } from "../sidebar/sidebar-right-shape";
import { PAUSE_MODE_ATOM } from "../states/tool";

// HOC para inyectar pausa

type PauseWrapperProps = {
  children: JSX.Element;
};

type ChangeWrapperProps = {
  children: JSX.Element;
  shape: Omit<ShapeState, "children" | "parentId">;
  type: keyof Omit<ShapeState, "id" | "tool" | "children" | "parentId">;
  isGlobalUpdate?: boolean;
};

type SetActionVariants<T> = {
  [K in keyof T]: SetStateAction<T[K]>;
}[keyof T];

export const ChangeWrapper = <K extends keyof ShapeState>(
  props: ChangeWrapperProps
): ReactElement => {
  const { children, shape, type, isGlobalUpdate = true } = props;
  if (!shape[type]) return children;
  const atom = shape[type];

  if (!atom) return children;
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  const [shapeValue, setShapeValue] = useAtom(atom);

  const spHook = useShapeUpdate();

  const enhanceChild = (child: ReactNode): ReactNode => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as ReactElement, {
      ...child.props,
      onFocus: () => setPause(true),
      onBlur: () => setPause(false),
      value: shapeValue,
      onChange: (
        value: Omit<ShapeBase[K], "id" | "tool" | "children" | "parentId">
      ) => {
        if (isGlobalUpdate) {
          spHook(type, value);
          return;
        }
        setShapeValue(value as SetActionVariants<typeof shapeValue>);
      },
    });
  };

  return <>{React.Children.map(children, enhanceChild)}</>;
};
export const PauseWrapper = ({ children }: PauseWrapperProps): ReactElement => {
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  const handleFocus = (
    event: FocusEvent<HTMLElement>,
    original?: (e: FocusEvent<HTMLElement>) => void
  ) => {
    setPause(true);
    original?.(event);
  };

  const handleBlur = (
    event: FocusEvent<HTMLElement>,
    original?: (e: FocusEvent<HTMLElement>) => void
  ) => {
    setPause(false);
    original?.(event);
  };

  const enhanceChild = (child: ReactNode): ReactNode => {
    if (!React.isValidElement(child)) return child;

    const originalOnFocus = child.props.onFocus;
    const originalOnBlur = child.props.onBlur;

    return React.cloneElement(child as ReactElement, {
      ...child.props,
      onFocus: (e: FocusEvent<HTMLElement>) => handleFocus(e, originalOnFocus),
      onBlur: (e: FocusEvent<HTMLElement>) => handleBlur(e, originalOnBlur),
    });
  };

  return <>{React.Children.map(children, enhanceChild)}</>;
};

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
          // width: "100%",
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
        // width: "100%",
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
  value?: number;
  onChange?: (value: number) => void;
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
  ...rest
}: InputNumberProps) => {
  // const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    if (!isNaN(newValue)) {
      onChange?.(newValue);
    }
  };
  return (
    <input
      {...rest}
      type="number"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={handleNumberChange}
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
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
  placeholder?: string;
  rows?: number;
};

const TextComponent = ({ onChange, value, style, ...rest }: InputTextProps) => {
  return (
    <input
      {...rest}
      type="text"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className={css({
        width: "auto",
        borderWidth: 1,
        borderColor: "gray.150",
        _dark: {
          borderWidth: 1,
          borderColor: "gray.650",
        },
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
  ...rest
}: InputTextProps) => {
  // const setPause = useSetAtom(PAUSE_MODE_ATOM);

  return (
    <textarea
      {...rest}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      // onFocus={() => setPause(true)} // Inicia pausa al entrar en el input
      // onBlur={() => setPause(false)} // Quita pausa al salir del input
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

type Props<T> = {
  value?: T;
  options: {
    id: string | number;
    label: string;
    value: string;
  }[];
  onChange?: (value: T) => void;
};

const Select = <T,>({ options, value, onChange, ...rest }: Props<T>) => {
  return (
    <select
      {...rest}
      value={`${value}`}
      className={css({
        width: "100%",
        color: "text",
        fontSize: "sm",
        backgroundColor: "transparent",
      })}
      onChange={(event) => onChange?.(event.target.value as T)}
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
      <label
        htmlFor={id}
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
          onChange={(event) => onChange?.(event.target.value)}
        />
      </label>
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
  withPause: PauseWrapper, // <- aquí
  withChange: ChangeWrapper,
};

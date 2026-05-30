import { SetStateAction, useAtom, useAtomValue, useSetAtom } from "jotai";
import React, {
  CSSProperties,
  FocusEvent,
  ReactElement,
  ReactNode,
} from "react";
import { flexLayoutAtom } from "../shapes/layout-flex";
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
  shape: Omit<ShapeState, "children">;
  type: keyof Omit<ShapeState, "id" | "tool" | "children" | "parentId">;
  isGlobalUpdate?: boolean;
};

type SetActionVariants<T> = {
  [K in keyof T]: SetStateAction<T[K]>;
}[keyof T];

export const ChangeWrapper = <K extends keyof ShapeState>(
  props: ChangeWrapperProps,
): ReactElement => {
  const { children, shape, type, isGlobalUpdate = true } = props;
  if (!shape[type]) return children;
  const atom = shape[type];

  if (!atom) return children;
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  const [shapeValue, setShapeValue] = useAtom(atom);

  const spHook = useShapeUpdate();
  const parent = useAtomValue(shape.parentId);
  const applyLayout = useSetAtom(flexLayoutAtom);

  const enhanceChild = (child: ReactNode): ReactNode => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as ReactElement, {
      ...child.props,
      onFocus: () => setPause(true),
      onBlur: () => setPause(false),
      value: shapeValue,
      onChange: (
        value: Omit<ShapeBase[K], "id" | "tool" | "children" | "parentId">,
      ) => {
        if (isGlobalUpdate) {
          spHook(type, value);
          if (parent) {
            applyLayout({ id: parent });
          }
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
    original?: (e: FocusEvent<HTMLElement>) => void,
  ) => {
    setPause(true);
    original?.(event);
  };

  const handleBlur = (
    event: FocusEvent<HTMLElement>,
    original?: (e: FocusEvent<HTMLElement>) => void,
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
  return <p className="text-[11px] font-semibold text-foreground">{text}</p>;
};

const GridComponent = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-[20px_1fr] content-center items-center justify-center gap-2">
      {children}
    </div>
  );
};
const Container = ({ children, id }: { children: ReactNode; id?: string }) => {
  const containerClassName =
    "min-h-[30px] gap-2 rounded-md border border-neutral-200 bg-neutral-100 p-2 text-sm text-foreground dark:border-neutral-800 dark:bg-neutral-900";

  if (id) {
    return (
      <label htmlFor={id} className={containerClassName}>
        {children}
      </label>
    );
  }
  return <div className={containerClassName}>{children}</div>;
};
const IconContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-[2px] bg-neutral-200 dark:bg-neutral-900">
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
      className="w-full flex-1 truncate bg-transparent px-1 text-[11px] text-foreground outline-none"
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
      className="h-[30px] w-auto rounded-md border border-neutral-200 bg-transparent p-2 text-sm text-foreground outline-none dark:border-neutral-700"
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
      className="h-full w-full resize-y rounded-md bg-transparent p-2 text-sm text-foreground outline-none"
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
      className="w-full bg-transparent text-sm text-foreground outline-none"
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
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-border p-2"
        style={{
          backgroundColor: value ?? "#ffffff",
        }}
      >
        <input
          type="color"
          id={id}
          className="m-0 h-0 w-0 border-0 p-0 opacity-0 outline-none"
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

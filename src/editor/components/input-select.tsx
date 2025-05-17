import { css } from "@stylespixelkit/css";

type Props = {
  value: string;
  options: {
    id: string | number;
    label: string;
    value: string;
  }[];
  labelText?: string;
  onChange: (value: string) => void;
};

export const InputSelect = ({ options, value, onChange, labelText }: Props) => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "md",
      })}
    >
      {labelText ? (
        <p
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "x-small",
          })}
        >
          {labelText}
        </p>
      ) : null}
      <select
        value={value}
        className={css({
          width: "100%",
          flex: 1,
          border: "container",
          backgroundColor: "primary",
          color: "text",
          padding: "md",
          borderRadius: "md",
          fontSize: "sm",
        })}
        onChange={(event) => onChange(event.target.value)}
      >
        {options?.map((e) => (
          <option key={e.id} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>
    </div>
  );
};

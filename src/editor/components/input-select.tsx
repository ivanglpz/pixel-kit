import { css } from "@stylespixelkit/css";
import { Input } from "./input";

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
    <Input.Container>
      <select
        value={value}
        className={css({
          width: "100%",
          flex: 1,
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
    </Input.Container>
  );
};

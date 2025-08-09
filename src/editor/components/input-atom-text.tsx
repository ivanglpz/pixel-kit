import { css } from "@stylespixelkit/css";
import { PrimitiveAtom, useAtom } from "jotai";
import { FC } from "react";

export const InputAtomText: FC<{ atom: PrimitiveAtom<string> }> = ({
  atom,
}) => {
  const [value, setValue] = useAtom(atom);
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={css({
        width: "100%",
        backgroundColor: "transparent",
        fontSize: "13px",
      })}
    />
  );
};

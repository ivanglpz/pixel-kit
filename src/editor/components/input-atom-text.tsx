import { css } from "@stylespixelkit/css";
import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { FC } from "react";
import { PAUSE_MODE_ATOM } from "../states/tool";

export const InputAtomText: FC<{ atom: PrimitiveAtom<string> }> = ({
  atom,
}) => {
  const [value, setValue] = useAtom(atom);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onClick={() => setPause(true)}
      onBlur={() => setPause(false)}
      onMouseLeave={() => setPause(false)}
      className={css({
        width: "100%",
        backgroundColor: "transparent",
        fontSize: "13px",
      })}
    />
  );
};

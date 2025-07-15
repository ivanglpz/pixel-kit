import { css } from "@stylespixelkit/css";
import { Tools } from "./Tools";

export function HeaderLogo() {
  return (
    <section
      className={css({
        paddingLeft: "md",
        paddingRight: "md",
        display: "grid",
        flexDirection: "row",
        borderRadius: "md",
        backgroundSize: "0.5rem 0.5rem",
        backgroundRepeat: "round",
        justifyContent: "space-between",
        alignItems: "center",
        gridTemplateColumns: "1fr 25px",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          width: "100%",
          gap: "md",
        })}
      >
        <Tools />
      </div>
    </section>
  );
}

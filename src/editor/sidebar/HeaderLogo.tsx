import { css } from "@stylespixelkit/css";

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
    ></section>
  );
}

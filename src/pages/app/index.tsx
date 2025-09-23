/* eslint-disable @next/next/no-img-element */
import { ICON_MODES_TABS } from "@/editor/icons/mode";
import { IPROJECT, PROJECTS_ATOM } from "@/editor/states/projects";
import { css } from "@stylespixelkit/css";
import { useAtomValue } from "jotai";

const CardProject = ({ project }: { project: IPROJECT }) => {
  const text = useAtomValue(project.name);
  const mode = useAtomValue(project.MODE_ATOM);
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateRows: "230px 1fr",
        borderRadius: "lg",
        borderWidth: 1,
        borderColor: "bg.elevated",
      })}
    >
      <img
        src="./placeholder.svg"
        alt=""
        className={css({
          height: "100%",
          width: "100%",
          objectFit: "cover",
          borderRadius: "lg",
        })}
      />
      <div
        className={css({
          padding: "lg",
          display: "grid",
          gridTemplateColumns: "30px 1fr",
          alignItems: "center",
        })}
      >
        {ICON_MODES_TABS[mode]}
        <div>
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            {text}
          </p>
          <p
            className={css({
              fontSize: "sm",
              opacity: 0.5,
            })}
          >
            Edited 1h ago
          </p>
        </div>
      </div>
    </div>
  );
};
const App = () => {
  const listProjects = useAtomValue(PROJECTS_ATOM);

  return (
    <div
      className={css({
        backgroundColor: "bg",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div
        className={css({
          backgroundColor: "black",
          overflowY: "hidden",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "300px 1fr",
        })}
      >
        <aside
          className={css({
            padding: "lg",
            backgroundColor: "bg",
            borderRightWidth: "1px",
            borderRightStyle: "solid",
            borderRightColor: "border", // ← usa el semantic token
            overflow: "hidden",
          })}
        >
          test
        </aside>
        <section
          className={css({
            backgroundColor: "black",
            overflowY: "scroll",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gridAutoRows: "300px",
            padding: "lg",
            gap: "xlg",
          })}
        >
          {listProjects?.map((e) => {
            return <CardProject key={e?.ID} project={e} />;
          })}
        </section>
      </div>
    </div>
  );
};
export default App;

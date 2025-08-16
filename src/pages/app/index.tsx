import { TabsProjects } from "@/components/tabs";
import { PROJECTS_ATOM } from "@/editor/states/projects";
import { css } from "@stylespixelkit/css";
import { useAtomValue } from "jotai";

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
          overflow: "hidden",
          display: "grid",
          gridTemplateRows: "45px 1fr",
          height: "100%",
        })}
      >
        <TabsProjects />
        <div
          className={css({
            backgroundColor: "black",
            overflowY: "hidden",
            height: "100%",
            display: "grid",
            gridTemplateColumns: "320px 1fr",
          })}
        >
          <div>test</div>
          <div
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
              return (
                <div
                  key={e?.ID}
                  className={css({
                    display: "grid",
                    gridTemplateRows: "230px 1fr",
                    borderRadius: "lg",
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
                    })}
                  >
                    My landing page
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;

/* eslint-disable @next/next/no-img-element */
import { css } from "@stylespixelkit/css";
import { Menu, Play } from "lucide-react";
import dynamic from "next/dynamic";
import { InputSelect } from "./components/input-select";
import useBrowser from "./hooks/useBrowser";
import { useConfiguration } from "./hooks/useConfiguration";
import useStopZoom from "./hooks/useStopZoom";
import { AllLayers } from "./layers/root.layers";
import { SidebarLeft } from "./sidebar/sidebar.left";
import SidebarRight from "./sidebar/sidebar.right";
import { Tools } from "./sidebar/Tools";
import PxStage from "./stage";

const PixelEditor = () => {
  useStopZoom();
  useBrowser();
  useConfiguration({
    type: "EDIT_IMAGE",
  });
  return (
    <div
      id="pixel-app"
      className={css({
        backgroundColor: "bg",
        height: "100dvh",
        width: "100%",
        display: "grid",
        gridTemplateRows: "60px 1fr",
        overflow: "hidden",
      })}
    >
      <header
        className={css({
          padding: "lg",
          display: "grid",
          alignItems: "center",
          justifyContent: "center",
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: "border", // ← usa el semantic token
          gridTemplateColumns: "3",
        })}
      >
        <section
          className={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "lg",
          })}
        >
          <Menu
            color="white"
            size={28}
            className={css({
              stroke: "black",
              _dark: {
                stroke: "white",
              },
            })}
          />
          <p
            className={css({
              color: "text",
              fontSize: "sm",
              fontWeight: 600,
            })}
          >
            Draft /{" "}
            <span
              className={css({
                opacity: 0.5,
              })}
            >
              My file01
            </span>
          </p>
        </section>
        <section
          className={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: "md",
          })}
        >
          <Tools />
        </section>
        <section
          className={css({
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "lg",
          })}
        >
          <button
            className={css({
              padding: "md",
              borderColor: "border",
              borderWidth: 1,
              borderRadius: "md",
              width: "37px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            })}
          >
            <Play size={18} />
          </button>
          <InputSelect
            onChange={() => {}}
            options={[
              {
                id: "1",
                label: "100%",
                value: "100",
              },
            ]}
            value={"100"}
          />
          <button
            className={css({
              padding: "md",
              borderColor: "border",
              borderWidth: 1,
              borderRadius: "md",
              backgroundColor: "primary",
              py: "5",
              px: "10",
              height: "35px",
            })}
          >
            <p
              className={css({
                color: "white",
                fontSize: "sm",
              })}
            >
              Share
            </p>
          </button>
          <img
            src="https://picsum.photos/200/300"
            alt="profile-user"
            className={css({
              width: "35px",
              height: "35px",
              borderRadius: "100px",
            })}
          />
        </section>
      </header>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "240px 1fr 240px",
          backgroundColor: "black",
          width: "100%",
          overflow: "hidden",
        })}
      >
        <SidebarLeft />
        <PxStage>
          <AllLayers />
        </PxStage>
        <SidebarRight />
      </div>
    </div>
  );
};
const ComponentApp = dynamic(Promise.resolve(PixelEditor), {
  ssr: false,
});

export default ComponentApp;

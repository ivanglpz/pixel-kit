import useSelectedShape from "@/editor/core/hooks/element/hook";
import { IKeyTool } from "@/editor/core/hooks/tool/types";
import themeColors from "@/themes";
import { AtomWrapper } from "@whil/ui";
import { FC } from "react";
import SideBarCode from "./tabs/elements/CODE/CODE";
import SidebarIMG from "./tabs/elements/IMG/sidebar-img";
import SidebarText from "./tabs/elements/TEXT/sidebar-text";
import SidebarBorderFC from "./tabs/elements/global/border/border";
import SidebarExportFC from "./tabs/elements/global/export/export";
import SidebarFillFC from "./tabs/elements/global/fill/fill";
import SidebarResolutionsFC from "./tabs/elements/global/resolution/resolution";
import SidebarShadowFC from "./tabs/elements/global/shadow/shadow";
import SidebarStrokeFC from "./tabs/elements/global/stroke/stroke";
import StageSidebarRight from "./tabs/stage";
import { css } from "../../../../../../styled-system/css";

type LayoutsTabs = {
  [key in IKeyTool]?: FC;
};
const layoutTabs: LayoutsTabs = {
  // BOX: SidebarRightBox,
  IMAGE: SidebarIMG,
  TEXT: SidebarText,
  CODE: SideBarCode,
};

const propertiesElements = (tool: IKeyTool) => [
  {
    Component: SidebarResolutionsFC,
  },
  {
    Component: layoutTabs?.[`${tool}`],
  },
  {
    Component: SidebarFillFC,
  },
  {
    Component: SidebarStrokeFC,
  },
  {
    Component: SidebarShadowFC,
  },
  {
    Component: SidebarBorderFC,
  },

  {
    Component: SidebarExportFC,
  },
];

const LayoutEditorSidebarRight: FC = () => {
  const { element } = useSelectedShape();
  return (
    <aside
      className={css({
        backgroundColor: "#0d0e0e",
        height: "auto",
        position: "absolute",
        top: 200,
        left: 2,
        zIndex: 3,
        maxWidth: "200px",
        width: "100%",
        borderRadius: 8,
      })}
    >
      <StageSidebarRight />
    </aside>
  );
};

export default LayoutEditorSidebarRight;

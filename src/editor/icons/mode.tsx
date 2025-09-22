/* eslint-disable jsx-a11y/alt-text */
import { LayoutDashboard } from "lucide-react";
import { MODE } from "../states/mode";

export const ICON_MODES_TABS: { [key in MODE]: JSX.Element } = {
  DESIGN_MODE: <LayoutDashboard size={16} />,
  // EDIT_IMAGE: <Image size={16} />,
  // FREE_DRAW: <Pencil size={16} />,
};

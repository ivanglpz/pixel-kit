import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SHAPES_NODES } from "../states/shapes";
import { css } from "@stylespixelkit/css";
import { CHANGE_SHAPE_NODE_ATOM, NODE_ATOM } from "../states/nodes";
import icons, { iconsWithTools } from "@/assets";

export const Nodes = ({ item }: { item: SHAPES_NODES }) => {
  const value = useAtomValue(item.state);
  const setDraggedNode = useSetAtom(NODE_ATOM);
  const [childrens] = useAtom(item.childrens);

  const SET_CHANGE = useSetAtom(CHANGE_SHAPE_NODE_ATOM);
  const handleDragStart = (e: React.DragEvent) => {
    setDraggedNode(item); // guardamos el nodo que se está arrastrando
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // permite soltar
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    SET_CHANGE({ id: item.id });
  };

  return (
    <>
      <li
        id={value.id + ` ${value.tool}`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={css({
          width: "100%",
          color: "text",
          padding: "md",
          borderRadius: "md",
          fontSize: "sm",
          listStyle: "none",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "lg",
          _hover: {
            backgroundColor: "primary",
          },
        })}
      >
        {iconsWithTools[value.tool]}

        <p>{value.tool}</p>
      </li>

      {childrens?.length > 0 ? (
        <ul
          className={css({
            paddingLeft: "lg",
            display: "flex",
            flexDirection: "column",
            gap: "md",
          })}
        >
          {childrens.map((e) => (
            <Nodes key={value.id + e.tool + e.id + "childrens"} item={e} />
          ))}
        </ul>
      ) : null}
    </>
  );
};

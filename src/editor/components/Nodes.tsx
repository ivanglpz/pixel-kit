import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { SHAPES_NODES } from "../states/shapes";
import { css } from "@stylespixelkit/css";
import { CHANGE_SHAPE_NODE_ATOM, NODE_ATOM } from "../states/nodes";

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
          border: "container",
          backgroundColor: "primary",
          color: "text",
          padding: "md",
          borderRadius: "md",
          fontSize: "sm",
          listStyle: "none",
        })}
      >
        {/* <p>{value.id.slice(0, 4)}</p> */}
        <p>{value.tool}</p>
      </li>

      {childrens?.length > 0 ? (
        <ul
          className={css({
            paddingLeft: "lg",
            display: "flex",
            flexDirection: "column",
            gap: "lg",
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

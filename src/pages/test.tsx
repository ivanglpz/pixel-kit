import { constants } from "@/editor/constants/color";
import Konva from "konva";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Layer, Rect, Stage, Transformer } from "react-konva";

type Shape = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

const initialShapes: Shape[] = [
  { id: "rect1", x: 60, y: 60, width: 100, height: 90, fill: "red" },
  { id: "rect2", x: 250, y: 100, width: 150, height: 90, fill: "green" },
];

function App() {
  const [shapes, setShapes] = useState<Shape[]>(initialShapes);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selection, setSelection] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [originalShapesBeforeTransform, setOriginalShapesBeforeTransform] =
    useState<Shape[]>([]);

  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);

  // Función para actualizar el transformer sin causar loops
  const updateTransformer = useCallback(() => {
    const transformer = trRef.current;
    const layer = layerRef.current;

    if (!transformer || !layer) return;

    // Encuentra los nodos seleccionados
    const selectedNodes = selectedIds
      .map((id) => layer.findOne(`#${id}`))
      .filter(Boolean) as Konva.Node[];

    // Solo actualiza si hay cambios en la selección
    const currentNodes = transformer.nodes();
    const hasChanges =
      selectedNodes.length !== currentNodes.length ||
      selectedNodes.some((node, index) => node !== currentNodes[index]);

    if (hasChanges) {
      transformer.nodes(selectedNodes);
      layer.batchDraw();
    }
  }, [selectedIds]);

  // Actualizar transformer cuando cambie la selección
  useEffect(() => {
    updateTransformer();
  }, [updateTransformer]);

  // Mouse down para iniciar selección rectangular
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Si clickeamos en un shape, no iniciamos selección rectangular
    if (e.target !== stageRef.current) return;

    const pos = stageRef.current?.getPointerPosition();
    if (!pos) return;

    setSelection({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      visible: true,
    });
  };

  // Mouse move para actualizar selección rectangular
  const handleMouseMove = () => {
    if (!selection || !selection.visible || !stageRef.current) return;

    const pos = stageRef.current.getPointerPosition();
    if (!pos) return;

    setSelection({
      x: Math.min(selection.x, pos.x),
      y: Math.min(selection.y, pos.y),
      width: Math.abs(pos.x - selection.x),
      height: Math.abs(pos.y - selection.y),
      visible: true,
    });
  };

  // Mouse up para completar selección múltiple
  const handleMouseUp = () => {
    if (!selection || !selection.visible || !stageRef.current) {
      return;
    }

    const box = {
      x: selection.x,
      y: selection.y,
      width: selection.width,
      height: selection.height,
    };

    // Solo buscar si el rectángulo de selección tiene tamaño
    if (box.width > 0 && box.height > 0) {
      const shapesInStage = stageRef.current.find(".rect");
      const selected = shapesInStage.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );
      setSelectedIds(selected.map((s) => s.getAttr("id")));
    }

    setSelection(null);
  };

  // Click para selección simple
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Si estamos en medio de una selección rectangular, ignorar
    if (selection?.visible) return;

    // Click en el stage vacío deselecciona todo
    if (e.target === stageRef.current) {
      setSelectedIds([]);
      return;
    }

    // Solo manejar clicks en rectángulos
    if (!e.target.hasName("rect")) return;

    const id = e.target.getAttr("id");
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;

    if (!metaPressed) {
      // Selección simple
      setSelectedIds([id]);
    } else {
      // Selección múltiple con teclas modificadoras
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );
    }
  };

  // Generar ID único para nuevas formas
  const generateId = () =>
    `rect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Manejo de drag start
  const handleDragStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const pos = e.target.position();
      setDragStartPos({ x: pos.x, y: pos.y });
      setIsDragging(true);
    },
    []
  );

  // Manejo de drag individual
  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
      const { x, y } = e.target.position();
      const isAltPressed = e.evt.altKey;

      setIsDragging(false);

      if (isAltPressed && dragStartPos) {
        // Alt + Drag = Copy
        const originalShape = shapes.find((s) => s.id === id);
        if (originalShape) {
          // Crear copia en la nueva posición
          const newShape = {
            ...originalShape,
            id: generateId(),
            x,
            y,
          };

          // Restaurar posición original
          e.target.position(dragStartPos);

          // Agregar la nueva forma
          setShapes((prev) => [...prev, newShape]);

          // Seleccionar la nueva forma
          setSelectedIds([newShape.id]);
        }
      } else {
        // Drag normal = Move
        setShapes((prev) =>
          prev.map((s) => (s.id === id ? { ...s, x, y } : s))
        );
      }

      setDragStartPos(null);
    },
    [shapes, dragStartPos]
  );

  // Manejo de transform start
  const handleTransformStart = useCallback(() => {
    setIsTransforming(true);
    // Guardar estado original de las formas seleccionadas
    setOriginalShapesBeforeTransform(
      shapes.filter((s) => selectedIds.includes(s.id))
    );
  }, [shapes, selectedIds]);

  // Al terminar transformación, actualizar estado
  const handleTransformEnd = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const transformer = trRef.current;
      if (!transformer) return;

      const nodes = transformer.nodes();
      const isAltPressed = e.evt?.altKey;

      setIsTransforming(false);

      if (isAltPressed && originalShapesBeforeTransform.length > 0) {
        // Alt + Transform = Copy
        const newShapes: Shape[] = [];
        const newSelectedIds: string[] = [];

        nodes.forEach((node) => {
          const originalId = node.getAttr("id");
          const newId = generateId();

          if (node instanceof Konva.Rect) {
            newShapes.push({
              id: newId,
              x: node.x(),
              y: node.y(),
              width: node.width() * node.scaleX(),
              height: node.height() * node.scaleY(),
              fill: node.fill(),
            });
            newSelectedIds.push(newId);

            // Resetear el nodo original a su posición/tamaño original
            const originalShape = originalShapesBeforeTransform.find(
              (s) => s.id === originalId
            );
            if (originalShape) {
              node.position({ x: originalShape.x, y: originalShape.y });
              node.size({
                width: originalShape.width,
                height: originalShape.height,
              });
              node.scaleX(1);
              node.scaleY(1);
            }
          }
        });

        // Agregar las nuevas formas
        setShapes((prev) => [...prev, ...newShapes]);

        // Seleccionar las nuevas formas
        setSelectedIds(newSelectedIds);
      } else {
        // Transform normal = Modify
        setShapes((prevShapes) =>
          prevShapes.map((shape) => {
            if (selectedIds.includes(shape.id)) {
              const node = nodes.find(
                (n) => n.getAttr("id") === shape.id
              ) as Konva.Rect;
              if (node) {
                return {
                  ...shape,
                  x: node.x(),
                  y: node.y(),
                  width: node.width() * node.scaleX(),
                  height: node.height() * node.scaleY(),
                };
              }
            }
            return shape;
          })
        );

        // Resetear scale después de aplicar las transformaciones
        nodes.forEach((node) => {
          if (node instanceof Konva.Rect) {
            node.scaleX(1);
            node.scaleY(1);
          }
        });
      }

      setOriginalShapesBeforeTransform([]);
    },
    [selectedIds, originalShapesBeforeTransform]
  );

  // Manejo de tecla Alt para mostrar cursor de copy
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (isDragging || isTransforming)) {
        document.body.style.cursor = "copy";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) {
        document.body.style.cursor = "default";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      document.body.style.cursor = "default";
    };
  }, [isDragging, isTransforming]);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      ref={stageRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      style={{ border: "1px solid gray" }}
    >
      <Layer ref={layerRef}>
        {shapes.map((shape) => (
          <Rect
            key={shape.id}
            id={shape.id}
            name="rect"
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            fill={shape.fill}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={(e) => handleDragEnd(e, shape.id)}
          />
        ))}

        {/* Transformer */}
        <Transformer
          ref={trRef}
          onTransformStart={handleTransformStart}
          onTransformEnd={handleTransformEnd}
          boundBoxFunc={(oldBox, newBox) => {
            // Limitar el tamaño mínimo
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />

        {/* Rectángulo de selección */}
        {selection && selection.visible && (
          <Rect
            ref={selectionRectRef}
            x={selection.x}
            y={selection.y}
            width={selection.width}
            height={selection.height}
            // fill="rgba(0,0,255,0.1)"
            stroke={constants.theme.colors.primary}
            strokeWidth={5}
          />
        )}
      </Layer>
    </Stage>
  );
}

const ComponentApp = dynamic(() => Promise.resolve(App), { ssr: false });

export default function MainApp() {
  return <ComponentApp />;
}

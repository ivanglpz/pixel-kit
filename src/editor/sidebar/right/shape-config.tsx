import { Button } from "@/editor/components/button";
import { InputCheckbox } from "@/editor/components/input-checkbox";
import InputColor from "@/editor/components/input-color";
import { InputNumber } from "@/editor/components/input-number";
import { InputSelect } from "@/editor/components/input-select";
import { InputSlider } from "@/editor/components/input-slider";
import { InputTextArea } from "@/editor/components/input-textarea";
import { IShape } from "@/editor/shapes/type.shape";
import { SHAPE_SELECTED_ATOM, SHAPE_UPDATE_ATOM } from "@/editor/states/shape";
import { DELETE_SHAPE_ATOM } from "@/editor/states/shapes";
import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";
import {
  Brush,
  Eye,
  EyeOff,
  Minus,
  PenTool,
  Plus,
  Ruler,
  Scan,
} from "lucide-react";
import { ChangeEvent, useRef } from "react";

const calculateScale = (
  originalWidth: number,
  originalHeight: number,
  containerWidth: number,
  containerHeight: number
): number => {
  const widthScale: number = containerWidth / originalWidth;
  const heightScale: number = containerHeight / originalHeight;

  const scale: number = Math.min(widthScale, heightScale);

  return scale;
};

const Separator = () => {
  return (
    <div
      className={css({
        marginTop: "md",
        height: 3.5,
        width: "100%",
        backgroundColor: "gray.700",
        // opacity: 0,
      })}
    ></div>
  );
};

export const LayoutShapeConfig = () => {
  // const onChange = props.onChange;

  const shape = useAtomValue(SHAPE_SELECTED_ATOM);
  const inputRef = useRef<HTMLInputElement>(null);
  const DELETE_SHAPE = useSetAtom(DELETE_SHAPE_ATOM);
  const shapeUpdate = useSetAtom(SHAPE_UPDATE_ATOM);
  if (shape === null) return null;

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.onload = () => {
        const scale: number = calculateScale(
          image.width,
          image.height,
          shape.width ?? 500,
          shape.height ?? 500
        );
        const newWidth: number = image.width * scale;
        const newHeight: number = image.height * scale;
        shapeUpdate({
          src: reader?.result as string,
          width: newWidth,
          height: newHeight,
        });
        // onChange("src", reader?.result as string);
        // onChange("width", newWidth);
        // onChange("height", newHeight);
      };

      image.src = reader?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    // if (!id) return;
    // DELETE_SHAPE({ id });
    // handleCleanShapeSelected();
  };

  return (
    <div
      className={`${css({
        display: "flex",
        flexDirection: "column",
        gap: "md",
      })} scrollbar_container`}
    >
      <p
        className={css({
          paddingBottom: "md",
          paddingTop: "sm",
          fontWeight: "bold",
          fontSize: "sm",
        })}
      >
        Shape
      </p>
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "x-small",
          height: "15px",
        })}
      >
        Position
      </p>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "lg",
        })}
      >
        <InputNumber
          iconType="x"
          value={shape.x}
          onChange={(v) => {
            shapeUpdate({
              x: v,
            });
          }}
        />
        <InputNumber
          iconType="y"
          labelText=""
          value={shape.y}
          onChange={(v) => {
            shapeUpdate({
              y: v,
            });
          }}
        />
      </div>
      <Separator />
      <p
        className={css({
          paddingBottom: "md",
          paddingTop: "sm",
          fontWeight: "bold",
          fontSize: "sm",
        })}
      >
        Layout
      </p>
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "x-small",
          height: "15px",
        })}
      >
        Dimensions
      </p>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "lg",
        })}
      >
        <InputNumber
          iconType="width"
          value={Number(shape.width) || 0}
          onChange={(v) => {
            shapeUpdate({
              width: v,
            });
          }}
        />
        <InputNumber
          iconType="height"
          labelText=""
          value={Number(shape.height) || 0}
          onChange={(v) => {
            shapeUpdate({
              height: v,
            });
          }}
        />
      </div>
      <Separator />
      <p
        className={css({
          paddingBottom: "md",
          paddingTop: "sm",
          fontWeight: "bold",
          fontSize: "sm",
        })}
      >
        Appearance
      </p>
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr 33.5px",
          alignItems: "end",
          gap: "md",
        })}
      >
        <div
          className={css({
            gap: "lg",
            display: "grid",
            gridTemplateColumns: "2",
          })}
        >
          <InputNumber
            iconType="opacity"
            labelText="Opacity"
            min={0}
            max={1}
            step={0.1}
            value={shape.opacity}
            onChange={(e) => {
              shapeUpdate({
                opacity: e,
              });
            }}
          />
          <InputNumber
            iconType="br"
            labelText="Corner Radius"
            min={0}
            max={9999}
            step={1}
            type={shape.isAllBorderRadius ? "text" : "number"}
            value={shape.isAllBorderRadius ? "Mixed" : shape.borderRadius || 0}
            onChange={(e) => {
              shapeUpdate({
                borderRadius: e,
              });
            }}
          />
        </div>
        <button
          className={css({
            backgroundColor: shape.isAllBorderRadius
              ? "gray.800"
              : "transparent",
            border: "none",
            cursor: "pointer",
            height: 33.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
          onClick={() => {
            shapeUpdate({
              isAllBorderRadius: !shape.isAllBorderRadius,
            });
          }}
        >
          <Scan size={14} />
        </button>
      </div>
      {shape.isAllBorderRadius && (
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "2",
            gap: "lg",
          })}
        >
          <InputNumber
            iconType="br"
            labelText="T.Left"
            value={shape.bordersRadius?.[0] || 0}
            onChange={(e) => {
              shapeUpdate({
                bordersRadius: [
                  e || 0,
                  shape.bordersRadius?.[1] || 0,
                  shape.bordersRadius?.[2] || 0,

                  shape.bordersRadius?.[3] || 0,
                ],
              });
            }}
          />
          <InputNumber
            iconType="br"
            labelText="T.Right"
            value={shape.bordersRadius?.[1] || 0}
            onChange={(e) => {
              shapeUpdate({
                bordersRadius: [
                  shape.bordersRadius?.[0] || 0,
                  e || 0,
                  shape.bordersRadius?.[2] || 0,
                  shape.bordersRadius?.[3] || 0,
                ],
              });
            }}
          />
          <InputNumber
            iconType="br"
            labelText="B.Left"
            value={shape.bordersRadius?.[3] || 0}
            onChange={(e) => {
              shapeUpdate({
                bordersRadius: [
                  shape.bordersRadius?.[0] || 0,
                  shape.bordersRadius?.[1] || 0,
                  shape.bordersRadius?.[2] || 0,
                  e || 0,
                ],
              });
            }}
          />
          <InputNumber
            iconType="br"
            labelText="B.Right"
            value={shape.bordersRadius?.[2] || 0}
            onChange={(e) => {
              shapeUpdate({
                bordersRadius: [
                  shape.bordersRadius?.[0] || 0,
                  shape.bordersRadius?.[1] || 0,
                  e || 0,
                  shape.bordersRadius?.[3] || 0,
                ],
              });
            }}
          />
        </div>
      )}
      <Separator />

      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <p
          className={css({
            paddingBottom: "md",
            paddingTop: "sm",
            fontWeight: "bold",
            fontSize: "sm",
          })}
        >
          Typography
        </p>
      </div>

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "lg",
          gridTemplateRows: "auto auto auto",
        })}
      >
        <div
          className={css({
            gridColumn: "2",
          })}
        >
          <InputSelect
            value={shape.fontFamily ?? "Roboto"}
            onChange={(e) => {
              shapeUpdate({
                fontFamily: e as IShape["fontFamily"],
              });
            }}
            options={[
              {
                id: `font-Roboto`,
                label: "Roboto",
                value: "Roboto",
              },
              {
                id: `font-Arial`,
                label: "Arial",
                value: "Arial",
              },
            ]}
          />
        </div>
        <InputSelect
          labelText=""
          value={shape.fontWeight ?? "normal"}
          onChange={(e) => {
            shapeUpdate({
              fontWeight: e as IShape["fontWeight"],
            });
            // onChange("fontWeight", e)
          }}
          options={[
            {
              id: `font-weight-lighter`,
              label: "Lighter",
              value: "lighter",
            },
            {
              id: `font-weight-normal`,
              label: "Normal",
              value: "normal",
            },
            {
              id: `font-weight-medium`,
              label: "Medium",
              value: "500",
            },
            {
              id: `font-weight-semi-bold`,
              label: "Semi Bold",
              value: "600",
            },
            {
              id: `font-weight-bold`,
              label: "Bold",
              value: "bold",
            },
            {
              id: `font-weight-bolder`,
              label: "Bolder",
              value: "bolder",
            },
          ]}
        />
        <InputNumber
          iconType="font"
          labelText=""
          min={12}
          max={72}
          step={4}
          onChange={(e) => {
            shapeUpdate({
              fontSize: e,
            });

            // onChange("fontSize", e)
          }}
          value={shape.fontSize || 0}
        />
        <div
          className={css({
            gridColumn: 2,
            gridRow: 3,
          })}
        >
          <InputTextArea
            labelText=""
            onChange={(e) => {
              shapeUpdate({
                text: e,
              });

              // onChange("fontSize", e)
            }}
            value={shape.text || ""}
          />
        </div>
      </div>
      <Separator />

      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <p
          className={css({
            paddingBottom: "md",
            paddingTop: "sm",
            fontWeight: "bold",
            fontSize: "sm",
          })}
        >
          Fill
        </p>
        <button
          className={css({
            color: "white",
            border: "none",
            padding: "sm",
            cursor: "pointer",
            borderRadius: "md",
          })}
          onClick={() => {
            shapeUpdate({
              fills: [
                ...(shape.fills || []),
                {
                  color: "#ffffff",
                  opacity: 1,
                  visible: true,
                },
              ],
            });
          }}
        >
          <Plus size={14} />
        </button>
      </div>
      {shape.fills?.length &&
        shape.fills.map((fill, index) => (
          <div
            key={`pixel-kit-shape-fill-${shape.id}-${shape.tool}-${index}`}
            className={css({
              display: "grid",
              gridTemplateColumns: "1fr 33.5px 33.5px",
              alignItems: "end",

              gap: "md",
            })}
          >
            <InputColor
              key={`pixel-kit-shape-fill-${shape.id}-${shape.tool}-${index}`}
              keyInput={`pixel-kit-shape-fill-${shape.id}-${shape.tool}-${index}`}
              labelText=""
              color={fill.color}
              onChangeColor={(e) => {
                const newFills = [...shape.fills];
                newFills[index].color = e;
                shapeUpdate({
                  fills: newFills,
                });
              }}
            />
            <button
              onClick={() => {
                const newFills = [...shape.fills];
                newFills[index].visible = !newFills[index].visible;
                shapeUpdate({
                  fills: newFills,
                });
              }}
              className={css({
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                height: 33.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              {fill.visible ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button
              onClick={() => {
                const newFills = [...shape.fills];
                newFills.splice(index, 1);
                shapeUpdate({
                  fills: newFills,
                });
              }}
              className={css({
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                height: 33.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              <Minus size={18} />
            </button>
          </div>
        ))}

      <Separator />
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <p
          className={css({
            paddingBottom: "md",
            paddingTop: "sm",
            fontWeight: "bold",
            fontSize: "sm",
          })}
        >
          Stroke
        </p>
        <button
          className={css({
            color: "white",
            border: "none",
            padding: "sm",
            cursor: "pointer",
            borderRadius: "md",
          })}
          onClick={() => {
            shapeUpdate({
              strokes: [
                ...(shape.strokes || []),
                {
                  color: "#000000",
                  visible: true,
                },
              ],
            });
          }}
        >
          <Plus size={14} />
        </button>
      </div>
      {shape.strokes?.length ? (
        <>
          {shape.strokes.map((stroke, index) => (
            <div
              key={`pixel-kit-shape-stroke-${shape.id}-${shape.tool}-${index}`}
              className={css({
                display: "grid",
                gridTemplateColumns: "1fr 33.5px 33.5px",
                alignItems: "end",

                gap: "md",
              })}
            >
              <InputColor
                key={`pixel-kit-shape-stroke-${shape.id}-${shape.tool}-${index}`}
                keyInput={`pixel-kit-shape-stroke-${shape.id}-${shape.tool}-${index}`}
                labelText=""
                color={stroke.color}
                onChangeColor={(e) => {
                  const newStrokes = [...shape.strokes];
                  newStrokes[index].color = e;
                  shapeUpdate({
                    strokes: newStrokes,
                  });
                }}
              />

              <button
                onClick={() => {
                  const newStrokes = [...shape.strokes];
                  newStrokes[index].visible = !newStrokes[index].visible;
                  shapeUpdate({
                    strokes: newStrokes,
                  });
                }}
                className={css({
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  height: 33.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                {stroke.visible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button
                onClick={() => {
                  const newStrokes = [...shape.strokes];
                  newStrokes.splice(index, 1);
                  shapeUpdate({
                    strokes: newStrokes,
                  });
                }}
                className={css({
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  height: 33.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                <Minus size={18} />
              </button>
            </div>
          ))}

          <div
            className={css({
              display: "grid",
              gridTemplateColumns: "2",
              gap: "lg",
            })}
          >
            <InputNumber
              iconType="width"
              min={0}
              max={9999}
              step={1}
              labelText="Weight"
              value={shape.strokeWidth || 0}
              onChange={(v) => {
                shapeUpdate({
                  strokeWidth: v,
                });
              }}
            />
            <div
              className={css({
                alignItems: "flex-end",
                display: "grid",
                gridTemplateColumns: "3",
              })}
            >
              <button
                onClick={() => {
                  shapeUpdate({
                    lineJoin: "round",
                    lineCap: "round",
                  });
                }}
                className={css({
                  background:
                    shape.lineJoin === "round" && shape.lineCap === "round"
                      ? "bg.muted"
                      : "transparent",
                  borderRadius: "6px",
                  padding: "sm",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "33.5px",
                })}
              >
                <Brush size={16} />
              </button>

              <button
                onClick={() => {
                  shapeUpdate({
                    lineJoin: "miter",
                    lineCap: "round",
                  });
                }}
                className={css({
                  background:
                    shape.lineJoin === "miter" && shape.lineCap === "round"
                      ? "bg.muted"
                      : "transparent",
                  borderRadius: "6px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "33.5px",
                })}
              >
                <Ruler size={16} />
              </button>

              <button
                onClick={() => {
                  shapeUpdate({
                    lineJoin: "bevel",
                    lineCap: "square",
                  });
                }}
                className={css({
                  background:
                    shape.lineJoin === "bevel" && shape.lineCap === "square"
                      ? "bg.muted"
                      : "transparent",
                  borderRadius: "6px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "33.5px",
                })}
              >
                <PenTool size={16} />
              </button>
            </div>
          </div>
          <InputNumber
            iconType="dashed"
            labelText={`Dash`}
            min={0}
            max={100}
            onChange={(e) => {
              shapeUpdate({
                dash: e,
              });

              // onChange("dash", e)
            }}
            value={shape.dash || 0}
          />
        </>
      ) : null}

      <Separator />

      {/* <Valid isValid={shape.tool === "IMAGE"}> */}
      <p
        className={css({
          color: "text",
          fontWeight: "600",
          fontSize: "sm",
        })}
      >
        Image
      </p>
      <Button text="Browser Files" onClick={() => inputRef.current?.click()} />
      <input
        ref={inputRef}
        type="file"
        color="white"
        accept="image/*"
        onChange={handleFiles}
        className={css({
          backgroundColor: "red",
          width: 0,
          height: 0,
          opacity: 0,
          display: "none",
        })}
      />

      <InputCheckbox
        text="Shadow"
        value={shape.shadowEnabled ?? true}
        onCheck={(e) => {
          shapeUpdate({
            shadowEnabled: e,
          });

          // onChange("shadowEnabled", e)
        }}
      />
      {/* <Valid isValid={shape.shadowEnabled ?? false}> */}
      <InputColor
        labelText="Color"
        keyInput={`pixel-kit-shape-shadow-${shape.id}-${shape.tool}`}
        color={shape.shadowColor}
        onChangeColor={(e) => {
          shapeUpdate({
            shadowColor: e,
          });
          // onChange("shadowColor", e)
        }}
      />
      <InputSlider
        labelText="X"
        onChange={(e) => {
          shapeUpdate({
            shadowOffsetX: e,
          });
          // onChange("shadowOffsetX", e)
        }}
        value={shape.shadowOffsetX || 0}
      />
      <InputSlider
        labelText="Y"
        onChange={(e) => {
          shapeUpdate({
            shadowOffsetY: e,
          });
          // onChange("shadowOffsetY", e)
        }}
        value={shape.shadowOffsetY || 0}
      />
      <InputSlider
        labelText="Blur"
        onChange={(e) => {
          shapeUpdate({
            shadowBlur: e,
          });
          // onChange("shadowBlur", e)
        }}
        value={shape.shadowBlur || 0}
      />

      <InputSlider
        min={0}
        labelText="Opacity"
        max={1}
        step={0.1}
        onChange={(e) => {
          shapeUpdate({
            shadowOpacity: e,
          });
          // onChange("shadowOpacity", e)
        }}
        value={shape.shadowOpacity || 0}
      />
    </div>
  );
};

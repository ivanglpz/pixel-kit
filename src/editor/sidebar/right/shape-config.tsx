import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { InputCheckbox } from "@/editor/components/input-checkbox";
import InputColor from "@/editor/components/input-color";
import { InputNumber } from "@/editor/components/input-number";
import { InputSelect } from "@/editor/components/input-select";
import { InputSlider } from "@/editor/components/input-slider";
import { IShape } from "@/editor/shapes/type.shape";
import { SHAPE_SELECTED_ATOM, SHAPE_UPDATE_ATOM } from "@/editor/states/shape";
import { DELETE_SHAPE_ATOM } from "@/editor/states/shapes";
import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";
import { LineCap, LineJoin } from "konva/lib/Shape";
import { Eye, EyeOff, Minus, Plus, Scan } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

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
        height: 2,
        width: "100%",
        backgroundColor: "gray.200",
        opacity: 0.5,
        _dark: {
          backgroundColor: "gray.700",
        },
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
  const [showBorders, setShowBorders] = useState(false);
  if (shape === null) return null;

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.onload = () => {
        // const scale: number = calculateScale(
        //   image.width,
        //   image.height,
        //   props.shape.width ?? 500,
        //   props.shape.height ?? 500
        // );
        // const newWidth: number = image.width * scale;
        // const newHeight: number = image.height * scale;
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
          labelText="Position"
          value={shape.x}
          onChange={() => {}}
        />
        <InputNumber
          iconType="y"
          labelText=""
          value={shape.x}
          onChange={() => {}}
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
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "2",
          gap: "lg",
        })}
      >
        <InputNumber
          iconType="width"
          labelText="Dimensions"
          value={Number(shape.width) || 0}
          onChange={() => {}}
        />
        <InputNumber
          iconType="height"
          labelText=""
          value={Number(shape.height) || 0}
          onChange={() => {}}
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
            value={shape.bordersRadius?.[0] || 0}
            onChange={(e) => {
              shapeUpdate({
                bordersRadius: [e || 0, e || 0, e || 0, e || 0],
              });
            }}
          />
        </div>
        <button
          className={css({
            backgroundColor: showBorders ? "transparent" : "gray.700",
            border: "none",
            cursor: "pointer",
            height: 33.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
          onClick={() => {
            setShowBorders(!showBorders);
          }}
        >
          <Scan size={14} />
        </button>
      </div>
      {showBorders && (
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "2",
            gap: "lg",
          })}
        >
          <InputNumber
            iconType="br"
            labelText="Top Left"
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
            labelText="Top Right"
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
            labelText="Bottom Left"
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
          <InputNumber
            iconType="br"
            labelText="Bottom Right"
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
        {/* <InputCheckbox
          text=""
          value={shape.fillEnabled ?? true}
          onCheck={(e) => {
            shapeUpdate({
              fillEnabled: e,
            });
          }}
        /> */}
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
      {/* <InputColor
        labelText=""
        keyInput={`pixel-kit-shape-fill-${shape.id}-${shape.tool}`}
        color={shape.backgroundColor}
        onChangeColor={(e) => {
          // onChange("backgroundColor", e)

          shapeUpdate({
            backgroundColor: e,
          });
        }}
      /> */}
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
        <InputCheckbox
          text=""
          value={shape.strokeEnabled ?? true}
          onCheck={(e) => {
            shapeUpdate({
              strokeEnabled: e,
            });
          }}
        />
      </div>
      <Valid isValid={shape.strokeEnabled ?? false}>
        <InputColor
          labelText=""
          keyInput={`pixel-kit-shape-stroke-${shape.id}-${shape.tool}`}
          color={shape.stroke}
          onChangeColor={(e) => {
            shapeUpdate({
              stroke: e,
            });

            // onChange("stroke", e)
          }}
        />
        <InputSlider
          labelText={`Thickness (${shape.strokeWidth})`}
          onChange={(e) => {
            shapeUpdate({
              strokeWidth: e,
            });
            // onChange("strokeWidth", e)
          }}
          value={shape.strokeWidth || 0}
        />
      </Valid>
      <Valid isValid={shape.tool === "IMAGE"}>
        <p
          className={css({
            color: "text",
            fontWeight: "600",
            fontSize: "sm",
          })}
        >
          Image
        </p>
        <Button
          text="Browser Files"
          onClick={() => inputRef.current?.click()}
        />
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
      </Valid>
      <Valid isValid={shape.tool === "DRAW"}>
        <InputCheckbox
          text="Bucket Fill"
          value={closed ?? false}
          onCheck={(e) => {
            shapeUpdate({
              closed: e,
            });
          }}
        />
      </Valid>
      {/* <Valid isValid={tool !== "IMAGE"}> */}

      {/* </Valid> */}

      <Valid isValid={shape.tool === "LINE" || shape.tool === "DRAW"}>
        <InputSelect
          labelText="Line Join"
          value={shape.lineJoin ?? "round"}
          onChange={(e) => {
            shapeUpdate({
              lineJoin: e as LineJoin,
            });
            // onChange("lineJoin", e)
          }}
          options={[
            {
              id: `line-join-1-round`,
              label: "Round",
              value: "round",
            },
            {
              id: `line-join-2-bevel`,
              label: "Bevel",
              value: "bevel",
            },
            {
              id: `line-join-3-miter`,
              label: "Miter",
              value: "miter",
            },
          ]}
        />

        <InputSelect
          labelText="Line Cap"
          value={shape.lineCap ?? "round"}
          onChange={(e) => {
            shapeUpdate({
              lineCap: e as LineCap,
            });
            // onChange("lineCap", e)
          }}
          options={[
            {
              id: `line-cap-1-round`,
              label: "Round",
              value: "round",
            },
            {
              id: `line-cap-2-butt`,
              label: "Butt",
              value: "butt",
            },
            {
              id: `line-cap-3-square`,
              label: "Square",
              value: "square",
            },
          ]}
        />
      </Valid>
      <Valid isValid={shape.tool === "TEXT"}>
        <InputSelect
          labelText="Font Weight"
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
        <InputSlider
          labelText="Font size"
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
      </Valid>

      <InputCheckbox
        text="Dash"
        value={shape.dashEnabled ?? true}
        onCheck={(e) => {
          shapeUpdate({
            dashEnabled: e,
          });

          // onChange("dashEnabled", e)
        }}
      />
      <Valid isValid={shape.dashEnabled ?? false}>
        <InputSlider
          labelText={`Array (${shape.dash})`}
          onChange={(e) => {
            shapeUpdate({
              dash: e,
            });

            // onChange("dash", e)
          }}
          value={shape.dash || 0}
        />
      </Valid>

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
      <Valid isValid={shape.shadowEnabled ?? false}>
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
      </Valid>

      <InputSlider
        labelText="Border radius"
        onChange={(e) => {
          shapeUpdate({
            borderRadius: e,
          });
          // onChange("borderRadius", e)
        }}
        value={shape.borderRadius || 0}
      />
    </div>
  );
};

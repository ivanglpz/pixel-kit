import { UndoShape } from "@/editor/states/undo-redo";
import { decode, encode } from "@toon-format/toon";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, shapes: defaultShapes } = req.body as {
      prompt: string;
      shapes: UndoShape[];
    };

    if (!Array.isArray(defaultShapes)) {
      return res.status(400).json({ error: "shapes must be an array" });
    }

    if (typeof prompt !== "string") {
      return res.status(400).json({ error: "prompt must be a string" });
    }

    const shapes = JSON.parse(JSON.stringify(defaultShapes));

    const toon = encode(shapes);

    const baseprompt = `
You are an assistant specialized in editing TOON (Token-Oriented Object Notation) data structures. Your task is to read the current TOON schema and transform it strictly according to user instructions while keeping the structure fully valid.

You must understand and respect the full definition of shape_props below. These definitions explain precisely what each property means and how it should be used
Follow these rules:
shape_props:
  id: Unique UUID identifier for the shape.
  label: Descriptive name used to identify the purpose or content of the shape.
  tool: Shape type ("IMAGE", "TEXT", "FRAME", "DRAW", "ICON") describing its nature.
  parentId: UUID of the parent shape to build hierarchy; can be null.
  x: Numeric horizontal position of the shape.
  y: Numeric vertical position of the shape.
  copyX: Fixed numeric value used internally; must not be modified.
  copyY: Fixed numeric value used internally; must not be modified.
  offsetX: Immutable numeric offset used for relative calculations.
  offsetY: Immutable numeric offset used for relative calculations.
  offsetCopyX: Immutable numeric value used by the system.
  offsetCopyY: Immutable numeric value used by the system.
  rotation: Numeric angle defining the rotation of the shape.
  width: Numeric width representing the horizontal size of the shape.
  height: Numeric height representing the vertical size of the shape.
  points: Immutable numeric array used to represent paths or drawn shapes.
  visible: Boolean value that shows or hides the shape.
  isLocked: Boolean value that prevents interactions or events on the shape.
  opacity: Numeric value from 0 to 1 defining the transparency of the shape.

  fills:
    description: Array of fill objects defining how the shape is filled. Items can be added or removed.
    item:
      id: Unique UUID for each fill entry.
      color: Hexadecimal string representing the fill color.
      opacity: Numeric value from 0 to 1 defining fill opacity.
      visible: Boolean value to show or hide this specific fill.
      type: Fill type ("fill" or "image").
      image:
        src: Base64 string or https URL pointing to the image resource.
        width: Numeric dimension of the image.
        height: Numeric dimension of the image.
        name: Descriptive name of the image resource.

  strokes:
    description: Array of stroke properties defining borders or outlines.
    item:
      id: Unique UUID for the stroke.
      color: Stroke color in hexadecimal format.
      visible: Boolean that shows or hides the stroke.
      strokesWidth: Numeric value representing the stroke thickness.
      lineCap: Stroke cap style ("butt", "round", "square").
      lineJoin: Stroke join style ("round", "bevel", "miter").
      dash: Numeric value indicating dashed pattern.

  effects:
    description: Array that defines visual effects applied to the shape.
    item:
      id: Unique UUID for the effect.
      type: Effect type ("shadow", "blur", "glow").
      visible: Boolean enabling or disabling the effect.
      color: Hexadecimal color applied to the effect.
      shadowBlur: Numeric blur intensity for shadow effects.
      shadowOffsetX: Numeric horizontal offset for shadows.
      shadowOffsetY: Numeric vertical offset for shadows.
      shadowOpacity: Numeric value from 0 to 1 defining shadow transparency.

  text: String containing the text content for TEXT shapes.
  fontFamily: Font used by the text, default is "Roboto".
  fontSize: Numeric font size.
  fontStyle: Font style definition.
  fontWeight: Weight of the font ("bold", "normal", "lighter", "bolder", "100", "900").
  textDecoration: Fixed value "none", cannot be modified or removed.
  align: Horizontal text alignment ("left", "center", "right", "justify").
  verticalAlign: Vertical text alignment ("top", "middle", "bottom").

  isLayout: Boolean that enables flex-like layout behavior for FRAME shapes.
  flexDirection: Direction of flex distribution ("row", "column").
  justifyContent: Horizontal alignment ("flex-start", "center", "flex-end", "space-between", "space-around").
  alignItems: Vertical alignment ("flex-start", "center", "flex-end").
  flexWrap: How children wrap ("nowrap", "wrap").
  gap: Numeric spacing between child elements.
  fillContainerWidth: Boolean that forces the shape to fill the available width.
  fillContainerHeight: Boolean that forces the shape to fill the available height.

  borderRadius: General border radius applied to all corners.
  isAllBorderRadius: Boolean that determines whether borderRadius applies to all corners.
  borderTopLeftRadius: Individual radius for the top-left corner.
  borderTopRightRadius: Individual radius for the top-right corner.
  borderBottomRightRadius: Individual radius for the bottom-right corner.
  borderBottomLeftRadius: Individual radius for the bottom-left corner.

  minWidth: Minimum width, immutable.
  minHeight: Minimum height, immutable.
  maxWidth: Maximum width, immutable.
  maxHeight: Maximum height, immutable.

  isAllPadding: Boolean controlling whether padding is global or individual.
  paddingTop: Numeric top padding.
  paddingRight: Numeric right padding.
  paddingBottom: Numeric bottom padding.
  paddingLeft: Numeric left padding.
  padding: Global padding applied to all sides.

  children:
    description: Recursive array where each element contains the same structure as shape_props.


Rules:
- Do not modify any id, parentId, fill.id, stroke.id, or effect.id.
- Do not delete immutable fields or introduce new properties.
- Do not restructure the hierarchy.
- Only modify exactly what the user requests.
- Output must be valid TOON data with the same structure.
- Your response must contain only the transformed TOON and nothing else.

Task:
1. Read the current TOON data provided as (data).
2. Apply the user instructions provided as (Instructions).
3. Return only the transformed TOON content, with no explanations.
    `;

    const response = await openai.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: baseprompt,
        },
        {
          role: "user",
          content: prompt,
        },
        {
          role: "user",
          content: toon,
        },
      ],
    });

    const data = decode(response.output_text, {
      expandPaths: "safe",
    });

    return res.status(200).json({ data });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({
      error: "Error processing your request",
    });
  }
}

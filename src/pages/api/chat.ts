import { UndoShape } from "@/editor/states/undo-redo";
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { v4 as uuid } from "uuid";

const exampleTool = [
  {
    id: uuid(),
    tool: "FRAME",
    state: {
      id: uuid(),
      x: 0,
      y: 0,
      width: 200,
      height: 100,
      tool: "FRAME",
      isLayout: true,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      gap: 10,
      padding: 10,
      borderRadius: 0,
      fills: [],
      strokes: [],
      effects: [],
      visible: true,
      opacity: 1,
      rotation: 0,
      isLocked: false,
      label: "Example Frame",
      parentId: null,
      children: [
        {
          id: uuid(),
          tool: "TEXT",
          state: {
            id: uuid(),
            x: 0,
            y: 0,
            width: 100,
            height: 20,
            tool: "TEXT",
            text: "Hello World",
            fontSize: 14,
            fontWeight: "normal",
            fontFamily: "Roboto",
            fontStyle: "normal",
            textDecoration: "none",
            align: "left",
            verticalAlign: "top",
            fills: [
              {
                visible: true,
                color: "#000000",
                opacity: 1,
                type: "fill",
                id: uuid(),
              },
            ],
            strokes: [],
            effects: [],
            visible: true,
            opacity: 1,
            rotation: 0,
            isLocked: false,
            label: "Example Text",
            parentId: null, // se actualizará con el id del frame
            children: [],
          },
        },
      ],
    },
  },
];

const tools = [
  {
    type: "function",
    name: "create_frame",
    description:
      "Creates a new FRAME element with optional TEXT or IMAGE children.",
    parameters: {
      type: "object",
      properties: {
        width: {
          type: "number",
          description: "Width of the FRAME in pixels",
        },
        height: {
          type: "number",
          description: "Height of the FRAME in pixels",
        },
        label: {
          type: "string",
          description: "Label for the FRAME",
        },
        children: {
          type: "array",
          description: "Optional children for the frame (TEXT or IMAGE)",
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["TEXT", "IMAGE"] },
              text: { type: "string" },
              src: { type: "string" },
            },
          },
        },
      },
      required: ["width", "height", "label"],
    },
  },
];

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

    const basePrompt = `
    # UI Generator Component Schema Guide

    Create UI components using the visual editor schema. Focus on understanding properties and their relationships for flexible component generation.

    ## Schema Structure Overview

    ### Core Element Properties
    - id: Unique UUID string for element identification
    - tool: Component type ("FRAME"|"TEXT"|"IMAGE") - always UPPERCASE
    - state: Object containing all element properties and configuration
    - pageId: Page identifier for element association
    - parentId: UUID of parent element (null for root elements)

    ### Universal State Properties
    - x, y: Position coordinates relative to parent container
    - width, height: Element dimensions (must be non-zero)
    - rotation: Rotation angle in degrees (default: 0)
    - opacity: Transparency level 0-1 (default: 1)
    - visible: Boolean visibility toggle (default: true)
    - isLocked: Boolean lock state for editing (default: false)

    ### Layout System (Required for all FRAMEs)
    - isLayout: Always true for FRAME elements
    - flexDirection: "row" (horizontal) | "column" (vertical)
    - flexWrap: "wrap" (allow wrapping) | "nowrap" (single line)
    - alignItems: Cross-axis alignment
      * "flex-start": Align to start
      * "center": Center alignment
      * "flex-end": Align to end
      * "stretch": Fill available space
    - justifyContent: Main-axis alignment
      * "flex-start": Pack to start
      * "center": Center items
      * "flex-end": Pack to end
      * "space-between": Equal space between items
      * "space-around": Equal space around items
    - gap: Space between child elements (numeric pixels)
    - padding: Internal spacing (numeric pixels)

    ### Padding System
    - padding: Uniform padding for all sides
    - paddingTop, paddingBottom, paddingLeft, paddingRight: Individual side padding
    - isAllPadding: Boolean indicating if padding is uniform

    ### Border Radius System
    - borderRadius: Uniform corner radius
    - borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius: Individual corners
    - isAllBorderRadius: Boolean indicating if radius is uniform

    ### Visual Properties
    - fills: Array of fill objects for backgrounds or images
      * Structure: { visible: boolean, color: "#HEXCODE", opacity: number, type: "fill", id: "unique-string" }
      * Structure: { visible: boolean, color: "#HEXCODE", opacity: number, type: "image", id: "unique-string", image:{ src:"https://...", width:100,height:100,name:"name.png"} }
    - strokes: Array of stroke objects for borders
      * Structure: { visible: boolean, color: "#HEXCODE", id: "unique-string" }
    - effects: Array for shadows and other effects
      * Shadow: { type: "shadow", id: "unique-string", visible:boolean, color:string }

    ### Container Properties
    - children: Array of nested elements
    - fillContainerWidth: Boolean for width filling behavior
    - fillContainerHeight: Boolean for height filling behavior
    - maxWidth, maxHeight: Maximum dimension constraints
    - minWidth, minHeight: Minimum dimension constraints

    ### Text Content
    - text: String content to display
    - fontSize: Font size in pixels
    - fontWeight: Weight specification
      * "normal": Standard weight
      * "bold": Bold text
      * "lighter"|"bolder": Relative weights
      * "100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900": Numeric weights
    - fontFamily: Font family name (default: system font)
    - fontStyle: Font style specification

    ### Text Alignment
    - align: Horizontal text alignment
      * "left": Left-aligned text
      * "center": Center-aligned text
      * "right": Right-aligned text
      * "justify": Justified text
    - verticalAlign: Vertical alignment within container
      * "top": Align to top
      * "middle": Center vertically
      * "bottom": Align to bottom

    ### Text Styling
    - textDecoration: Text decoration ("underline"|"line-through"|"none")
    - color: Text color in hex format "#HEXCODE"

    ### Layout Properties (Inherited)
    - TEXT elements inherit standard positioning and sizing properties
    - No fills array needed (text color handled by color property)
    - Can have strokes for text outlines (optional)

    ### Image Source
    - fills: Required array containing image fill object
      * Must include: visible, color, opacity, type, id
      * image object: { height: number, width: number, name: "filename.ext", src: "URL" }
      * Use Lorem Picsum: "https://picsum.photos/WIDTH/HEIGHT"

    ### Image Sizing
    - width, height: Display dimensions (can differ from source dimensions)
    - Image maintains aspect ratio unless explicitly styled otherwise

    ### Preservation Rules
    - Never remove or replace existing fills
    - Only append new fills to existing array
    - Preserve all nested object properties completely

    ### Parent-Child Structure
    - parentId must match parent element's id
    - Child positioning (x, y) is relative to parent container
    - Children array contains nested elements
    - Layout properties of parent affect child positioning

    ### Sizing Relationships
    - Child elements constrained by parent dimensions
    - Padding reduces available space for children
    - Gap creates spacing between siblings
    - FlexDirection determines layout flow

    ### Color and Visual Hierarchy
    - fills array can contain multiple fill objects
    - Later fills in array appear on top
    - opacity affects entire element and children
    - Strokes appear on top of fills

    ### Planning Phase
    1. Determine component type and purpose
    2. Calculate required dimensions and positioning
    3. Plan parent-child relationships and nesting
    4. Define layout flow (flexDirection) and alignment
    5. Specify colors, typography, and visual properties

    ### Implementation Rules
    - Generate unique UUIDs for new elements only
    - Preserve existing UUIDs and pageIds completely
    - Include all required properties with appropriate defaults
    - Ensure proper parent-child linking via parentId
    - Validate layout property combinations make sense

    ### Property Defaults
    - Numeric properties: Use 0 if unused
    - Boolean properties: Use false if inactive
    - String properties: Use empty string if unused
    - Arrays: Use empty array [] if no items
    - Required properties: Always include with valid values

    ### Always return a top-level array.
    ### Return only valid JSON. Do not include backticks, comments, explanations, or any extra text. The output must be ready to be parsed with JSON.parse().

    This schema enables creation of any UI component by understanding how properties interact and combining them effectively.
    `;
    console.log(basePrompt);

    const userPrompt = `
    Existing array: ${JSON.stringify(shapes)}
    Instructions: ${prompt}
    Return the updated array following all rules.
    `;
    console.log(userPrompt);

    const response = await openai.responses.create({
      model: "gpt-5",
      tools: [
        {
          type: "function",
          name: "get_horoscope",
          description: "Get today's horoscope for an astrological sign.",
          parameters: {
            type: "object",
            properties: {
              sign: {
                type: "string",
                description: "An astrological sign like Taurus or Aquarius",
              },
            },
            required: ["sign"],
          },
          strict: true,
        },
      ],
      input: [
        { role: "user", content: "What is my horoscope? I am an Aquarius." },
      ],
    });

    response.output.forEach((item) => {
      if (item.type == "function_call") {
        if (item.name == "get_horoscope") {
          console.log("Function call arguments:", item.arguments);
        }
        // 3. Execute the function logic for get_horoscope
        // const horoscope = get_horoscope(JSON.parse(item.arguments));

        // 4. Provide function call results to the model
        // input_list.push({
        //   type: "function_call_output",
        //   call_id: item.call_id,
        //   output: json.dumps({
        //     horoscope,
        //   }),
        // });
      }
    });

    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   messages: [],
    //   temperature: 0,
    //   response_format: { type: "json_object" },
    // });

    return res.status(200).json({ message: "Request processed successfully" });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({
      error: "Error processing your request",
    });
  }
}

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
You are an assistant that understands the TOON (Token-Oriented Object Notation) format and edits UI schema rows strictly according to the user's instructions.

Follow these rules:

UI Component Schema Guide:
Each UI element is a flat object with these properties:
- id, tool (FRAME | TEXT | IMAGE), pageId, parentId
- Position: x, y
- Size: width, height
- Transform: rotation, opacity, visible, isLocked

FRAME-only layout:
- isLayout, flexDirection, flexWrap, alignItems, justifyContent, gap
- padding or per-side padding fields
- borderRadius or per-radius fields
- children (list of child ids)
- fillContainerWidth, fillContainerHeight
- maxWidth, maxHeight, minWidth, minHeight

TEXT-only:
- text
- fontSize, fontWeight, fontFamily, fontStyle
- align, verticalAlign, textDecoration
- color

IMAGE-only:
- imageRef

Rules:
- Preserve all existing ids and references.
- Do not replace existing fills or internal references.
- Do not introduce nested objects, new structural patterns, or additional arrays.
- Only modify values required by the user.
- Parent–child relations must stay valid.
- Output must remain valid TOON using the exact same encoding structure.

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

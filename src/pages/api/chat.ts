import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { inputArray, instructions } = req.body;

    if (!Array.isArray(inputArray)) {
      return res.status(400).json({ error: "inputArray must be an array" });
    }

    if (typeof instructions !== "string") {
      return res.status(400).json({ error: "instructions must be a string" });
    }
    // Aquí declaras tu prompt completo
    const basePrompt = `
You need to generate and modify an array of objects that represent visual editor elements.
Each object contains properties such as width, height, position (x, y), colors (fill, stroke), shadows, etc.
Every element can optionally include a "children" property that contains nested elements.

Strict rules:

1. The "tool" property must always be in UPPERCASE. Possible values are: IMAGE, TEXT, FRAME, DRAW.
2. Do not create or use the "DRAW" tool. Omit it completely.
3. FRAME elements are containers. They are equivalent to HTML structural tags like <div>, <section>, <main>.
   - They must support "children" to nest other elements.
   - Always set "isLayout": true for all FRAME elements.
   - Must include layout properties: isLayout, flexDirection, flexWrap, alignItems, justifyContent, padding, gap.
   - padding must always be present (numeric, default 0 if unused).
   - gap must always be present (numeric, default 0 if unused).
   - FRAMEs can be horizontal or vertical:
     - Horizontal: "flexDirection": "row"
     - Vertical: "flexDirection": "column"
   - FRAMEs can wrap or not wrap:
     - "flexWrap": "wrap" or "flexWrap": "nowrap".
4. IMAGE elements must always provide a URL from lorem picsum (https://picsum.photos).
   - They must include a "fills" array as the first element in state with type: "image".
   - Example: "fills": [{ "type": "image", "src": "https://picsum.photos/200/300" }].
5. TEXT elements must always use the "text" property to render content.
   - Respect text-related props: fontWeight, textDecoration, align, verticalAlign.
   - Example: "text": "Hello World".
6. For SHADOW elements, include an object in state with type: "shadow".
7. UUIDs must be unique and dynamically generated only for newly added elements.
8. Do not modify or replace existing UUIDs or pageIds of elements that are already present in the input array. They must remain exactly as provided.
9. The parentId of each child must match the UUID of its parent.
10. Do not remove, shorten, or change the schema. All properties must be present exactly as provided.
    - If a property is unused, set it to 0, false, an empty string, or an empty array depending on its type.
    - The schema must remain fully intact.
11. Do not insert comments inside the array. The output must always be a valid array that can be parsed directly with JSON.parse.
12. Use layout properties such as isLayout, flexDirection (row or column), flexWrap (wrap or nowrap), alignItems, justifyContent, padding, and gap to structure elements properly.
13. Text properties must respect:
    - fontWeight: "bold" | "normal" | "lighter" | "bolder" | "100" | "900"
    - textDecoration?: string
    - align: "left" | "center" | "right" | "justify"
    - verticalAlign: "top" | "middle" | "bottom"
14. This is an expert-level task: when the user asks for UI components (e.g. input, button, card, or text), you must create them following the schema exactly.
15. The array shown below is only an example. You may be given a completely different input array.
    - Existing elements in that array must retain all their original UUIDs and pageIds.
    - Only generate new UUIDs for any newly added objects.
16. The user will provide instructions describing new elements, layout changes, or styling modifications.
    - "Agregar" / "Add" means create and append a new element object.
    - "Actualizar" / "Cambiar" / "Update" / "Change" means modify the value of an existing property (e.g. color, size, text).
    - "Eliminar" / "Remove" / "Delete" means remove the element object from the array or from the children of its parent.
17. User instructions may be written in different languages (e.g. English, Spanish). Always interpret them according to these rules and apply them consistently.
18. When adding a new element, you must always define a non-zero width and height.
    - For TEXT elements, width and height must be proportional to the fontSize and length of the text.
19. Always return a top-level array.
20. Return only valid JSON. Do not include backticks, comments, explanations, or any extra text. The output must be ready to be parsed with JSON.parse().
`;

    const userPrompt = `
Existing array: ${JSON.stringify(inputArray)}
Instructions: ${instructions}
Return the updated array following all rules.
`;

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: basePrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0,
      response_format: { type: "json_object" },
    });

    // Parse the model's response as a JSON array

    return res
      .status(200)
      .json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({
      error: "Error processing your request",
    });
  }
}

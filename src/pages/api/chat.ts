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
    // Aquí declaras tu prompt completo
    const prompt = `
You need to generate and modify an array of objects that represent visual editor elements.
Each object contains properties such as width, height, position (x, y), colors (fill, stroke), shadows, etc.
Every element can optionally include a "children" property that contains nested elements.

Strict rules:

1. The "tool" property must always be in UPPERCASE. Possible values are: IMAGE, TEXT, FRAME, DRAW.
2. Do not create or use the "DRAW" tool. Omit it completely.
3. For IMAGE elements, always provide a URL from lorem picsum (https://picsum.photos).
4. UUIDs must be unique and dynamically generated only for newly added elements.
5. Do not modify or replace existing UUIDs or pageIds of elements that are already present in the input array. They must remain exactly as provided.
6. The parentId of each child must match the UUID of its parent.
7. Do not remove, shorten, or change the schema. All properties must be present exactly as provided.
   - If a property is unused, set it to 0, false, an empty string, or an empty array depending on its type.
   - The schema must remain fully intact.
8. Do not insert comments inside the array. The output must always be a valid array that can be parsed directly with JSON.parse.
9. Use layout properties such as isLayout, flexDirection (row or column), alignItems, and justifyContent to structure elements properly.
   - Set isLayout to true or false depending on the context.
10. This is an expert-level task: when the user asks for UI components (e.g. input, button, card, or text), you must create them following the schema exactly.
11. The array shown below is only an example. You may be given a completely different input array.
    - Existing elements in that array must retain all their original UUIDs and pageIds.
    - Only generate new UUIDs for any newly added objects.
12. The user will provide instructions describing new elements, layout changes, or styling modifications.
    - You must analyze these instructions and apply them to generate the new array.
    - Ensure all new elements follow the schema exactly.
    - Existing elements should remain unchanged unless explicitly instructed by the user.

Example array (do not treat these IDs as mandatory; they are for reference only):

[
    {
        "id": "5c97537d-22ac-4f27-8fb4-e99ff6bd9432",
        "tool": "FRAME",
        "state": {
            "id": "5c97537d-22ac-4f27-8fb4-e99ff6bd9432",
            "x": 363,
            "y": 440,
            "tool": "FRAME",
            "align": "left",
            "offsetX": 0,
            "offsetY": 0,
            "verticalAlign": "top",
            "paddingBottom": 10,
            "paddingTop": 10,
            "borderBottomLeftRadius": 0,
            "isAllPadding": true,
            "borderBottomRightRadius": 0,
            "borderTopLeftRadius": 0,
            "borderTopRightRadius": 0,
            "paddingLeft": 10,
            "paddingRight": 10,
            "padding": 10,
            "maxHeight": 0,
            "maxWidth": 0,
            "minHeight": 0,
            "minWidth": 0,
            "effects": [],
            "isLocked": false,
            "fillContainerHeight": false,
            "fillContainerWidth": false,
            "label": "Frame",
            "parentId": null,
            "rotation": 0,
            "opacity": 1,
            "fills": [
                {
                    "visible": true,
                    "color": "#ffffff",
                    "opacity": 1,
                    "type": "fill",
                    "id": "f191c3e9-3c9e-465f-a4be-114760fd711c",
                    "image": {
                        "height": 0,
                        "name": "default.png",
                        "src": "/placeholder.svg",
                        "width": 0
                    }
                }
            ],
            "isLayout": true,
            "alignItems": "flex-start",
            "flexDirection": "row",
            "flexWrap": "nowrap",
            "justifyContent": "flex-start",
            "gap": 10,
            "strokes": [],
            "visible": true,
            "height": 247,
            "width": 275,
            "points": [],
            "strokeWidth": 1,
            "lineCap": "round",
            "lineJoin": "round",
            "shadowBlur": 0,
            "shadowOffsetY": 1,
            "shadowOffsetX": 1,
            "shadowOpacity": 1,
            "isAllBorderRadius": true,
            "borderRadius": 0,
            "dash": 0,
            "fontStyle": "Roboto",
            "textDecoration": "none",
            "fontWeight": "normal",
            "fontFamily": "Roboto",
            "fontSize": 24,
            "text": "Hello World",
            "children": [
                {
                    "id": "0813813e-761f-4b28-b6cc-f27458caeb4c",
                    "pageId": "8eb9cfc3-023f-4204-a745-3d5347d1f057",
                    "tool": "TEXT",
                    "state": {
                        "id": "0813813e-761f-4b28-b6cc-f27458caeb4c",
                        "x": 10,
                        "y": 10,
                        "tool": "TEXT",
                        "align": "left",
                        "offsetX": 0,
                        "offsetY": 0,
                        "verticalAlign": "top",
                        "paddingBottom": 10,
                        "paddingTop": 10,
                        "borderBottomLeftRadius": 0,
                        "isAllPadding": true,
                        "borderBottomRightRadius": 0,
                        "borderTopLeftRadius": 0,
                        "borderTopRightRadius": 0,
                        "paddingLeft": 10,
                        "paddingRight": 10,
                        "padding": 10,
                        "maxHeight": 0,
                        "maxWidth": 0,
                        "minHeight": 0,
                        "minWidth": 0,
                        "effects": [],
                        "isLocked": false,
                        "fillContainerHeight": false,
                        "fillContainerWidth": false,
                        "label": "Text",
                        "parentId": "5c97537d-22ac-4f27-8fb4-e99ff6bd9432",
                        "rotation": 0,
                        "opacity": 1,
                        "fills": [
                            {
                                "visible": true,
                                "color": "#ff0000",
                                "opacity": 1,
                                "type": "fill",
                                "id": "f191c3e9-3c9e-465f-a4be-114760fd711c",
                                "image": {
                                    "height": 0,
                                    "name": "default.png",
                                    "src": "/placeholder.svg",
                                    "width": 0
                                }
                            }
                        ],
                        "isLayout": false,
                        "alignItems": "flex-start",
                        "flexDirection": "row",
                        "flexWrap": "nowrap",
                        "justifyContent": "flex-start",
                        "gap": 10,
                        "strokes": [],
                        "visible": true,
                        "height": 184.00000000000023,
                        "width": 189.00000000000009,
                        "points": [],
                        "strokeWidth": 1,
                        "lineCap": "round",
                        "lineJoin": "round",
                        "shadowBlur": 0,
                        "shadowOffsetY": 1,
                        "shadowOffsetX": 1,
                        "shadowOpacity": 1,
                        "isAllBorderRadius": true,
                        "borderRadius": 0,
                        "dash": 0,
                        "fontStyle": "Roboto",
                        "textDecoration": "none",
                        "fontWeight": "normal",
                        "fontFamily": "Roboto",
                        "fontSize": 24,
                        "text": "Hello World",
                        "children": []
                    }
                }
            ]
        },
        "pageId": "8eb9cfc3-023f-4204-a745-3d5347d1f057"
    }
]
`;

    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          "You are an expert UI layout generator. Always follow schema and rules strictly.",
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      response_format: { type: "json_object" },
      temperature: 0,
    });

    return res.status(200).json({
      content: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({
      error: "Error processing your request",
    });
  }
}

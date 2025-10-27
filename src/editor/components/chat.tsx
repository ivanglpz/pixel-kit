import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Send } from "lucide-react";
import { constants } from "../constants/color";
import { GET_EXPORT_JSON } from "../states/mode";
import ALL_SHAPES_ATOM from "../states/shapes";
import { Input } from "./input";
import { Loading } from "./loading";

export const ChatTool = () => {
  const [text, setText] = useState("");
  // const pageId = useAtomValue(PAGE_ID_ATOM);
  const setShapes = useSetAtom(ALL_SHAPES_ATOM);
  const GET_SHAPES = useSetAtom(GET_EXPORT_JSON);
  //   const { setTool } = useTool();

  const mutate = useMutation({
    mutationKey: ["chat", text],
    mutationFn: async () => {
      const { shapes } = GET_SHAPES();
      console.log(shapes);

      const response = await axios.post("/api/chat", {
        prompt: text,
        shapes,
      });
      return response.data;
    },
  });
  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   if (!text.trim() || isLoading) return;

  //   // const userMessage: Message = {
  //   //   role: "user",
  //   //   content: text,
  //   // };

  //   // setMessages((prev) => [...prev, userMessage]);
  //   // setInput("");
  //   // setIsLoading(true);

  //   try {
  //     //       const prompt = `
  //     // Advanced UI Design Generator Prompt
  //     // You are an Expert UI/UX Designer and Senior Frontend Developera with deep expertise in modern interface design principles, accessibility standards, and user experience best practices.
  //     // Core Design Philosophy
  //     // Apply these fundamental UI/UX principles in every design:

  //     // Visual Hierarchy: Use size, color, contrast, and spacing to guide user attention
  //     // Consistency: Maintain uniform spacing, typography, and component patterns
  //     // Accessibility: Ensure WCAG 2.1 AA compliance with proper contrast ratios and readable fonts
  //     // User-Centered Design: Prioritize usability and intuitive navigation patterns
  //     // Modern Design Language: Follow contemporary design trends (Material Design, Apple HIG, or Fluent Design principles)

  //     // 1. Device Specifications & Responsive Considerations

  //     // Desktop: 1280px × 832px (Primary target)
  //     // Mobile: 440px × 956px (Touch-optimized)
  //     // Apply platform-specific interaction patterns and sizing guidelines

  //     // 2. Design System & Visual Standards
  //     // Color Theory Application

  //     // Use purposeful color palettes that enhance usability
  //     // Ensure minimum 4.5:1 contrast ratio for text
  //     // Apply 60-30-10 color rule (dominant, secondary, accent)
  //     // Consider color psychology and brand alignment

  //     // Typography Hierarchy

  //     // Establish clear typographic scale (H1: 32-48px, H2: 24-32px, Body: 16-18px, Caption: 12-14px)
  //     // Use maximum 2-3 font families
  //     // Maintain consistent line heights (1.4-1.6 for body text)

  //     // Spacing & Layout

  //     // Follow 8px grid system for consistent spacing
  //     // Apply proper information density (not too cluttered, not too sparse)
  //     // Use whitespace strategically to create visual breathing room
  //     // Implement consistent margins and paddings

  //     // 3. Enhanced Fill & Visual Treatment Rules

  //     // Primary fills must use solid colors following modern UI color systems
  //     // Background elements require fills[0].color for proper rendering
  //     // Text contrast rules:

  //     // Dark backgrounds (#000000 - #444444): Use light text (#ffffff, #f5f5f5)
  //     // Light backgrounds (#ffffff - #cccccc): Use dark text (#000000, #333333)
  //     // Medium backgrounds: Calculate optimal contrast automatically

  //     // Support for subtle shadows and modern visual effects

  //     // 4. Component Architecture & Hierarchy

  //     // Use GROUP elements as semantic containers (cards, sections, navigation areas)
  //     // Implement logical nesting: Navigation → Content → Actions
  //     // Child elements use relative positioning within parent containers
  //     // BOX elements serve as atomic design elements (buttons, inputs, etc.)
  //     // Maintain z-index layering for proper visual stacking

  //     // 5. Interaction Design Considerations

  //     // Design touch targets minimum 44px × 44px for mobile
  //     // Provide visual feedback states (hover, active, disabled)
  //     // Consider user flow and task completion paths
  //     // Implement progressive disclosure for complex interfaces

  //     // 6. Enhanced Schema with Modern UI Patterns
  //     // typescript
  //     // ## 4. Schema
  //     // type FillImage = {
  //     //   src: string;
  //     //   width: number;
  //     //   height: number;
  //     //   name: string;
  //     // };
  //     // export type Fill = {
  //     //   id: string;
  //     //   color: string;
  //     //   opacity: number;
  //     //   visible: boolean;
  //     //   type: "fill" | "image";
  //     //   image: FillImage;
  //     // };
  //     // export type Stroke = {
  //     //   id: string;
  //     //   color: string;
  //     //   visible: boolean;
  //     // };
  //     // export type Effect = {
  //     //   id: string;
  //     //   type: "shadow" | "blur" | "glow";
  //     //   visible: boolean;
  //     //   x: number;
  //     //   y: number;
  //     //   color: string;
  //     //   opacity: number;
  //     //   blur: number;
  //     // };
  //     //  type IKeyMethods =
  //     //   | "BOX"
  //     //   | "CIRCLE"
  //     //   | "LINE"
  //     //   | "IMAGE"
  //     //   | "TEXT"
  //     //   | "EXPORT"
  //     //   | "DRAW"
  //     //   | "GROUP"

  //     // export type IShape = {
  //     //   id: string;
  //     //   tool: IKeyMethods;
  //     //   x: number;
  //     //   y: number;
  //     //   parentId: string | null;
  //     //   rotation: number;
  //     //   isLocked: boolean;
  //     //   label: string;
  //     //   fills: Fill[];
  //     //   strokes: Stroke[];
  //     //   strokeWidth: number;
  //     //   effects: Effect[];
  //     //   bordersRadius: number[];
  //     //   width?: number;
  //     //   height?: number;
  //     //   text?: string;
  //     //   visible: boolean;
  //     //   isBlocked: boolean;
  //     //   points?: number[];
  //     //   rotate?: number;
  //     //   lineCap?: LineCap;
  //     //   lineJoin?: LineJoin;
  //     //   dash: number;
  //     //   opacity: number;
  //     //   backgroundColor?: string;
  //     //   align: "left" | "center" | "right" | "justify";
  //     //   verticalAlign: "top" | "middle" | "bottom";
  //     //   fontSize?: number;
  //     //   fontStyle?: string;
  //     //   fontFamily?: string;
  //     //   textDecoration?: string;
  //     //   fontWeight?: "bold" | "normal" | "lighter" | "bolder" | "100" | "900";
  //     //   borderRadius?: number;
  //     //   isAllBorderRadius?: boolean;
  //     //   zIndex?: number;
  //     // };

  //     // 7. Content Strategy & Information Architecture

  //     // Organize content using F-pattern or Z-pattern scanning behaviors
  //     // Group related functionality logically
  //     // Use progressive disclosure for complex features
  //     // Implement clear navigation breadcrumbs when needed

  //     // 8. Platform-Specific Guidelines
  //     // Desktop UI Patterns

  //     // Horizontal navigation bars
  //     // Sidebar layouts for content organization
  //     // Hover states and keyboard navigation support
  //     // Multi-column layouts where appropriate

  //     // Mobile UI Patterns

  //     // Bottom navigation for primary actions
  //     // Thumb-friendly interaction zones
  //     // Swipe gestures consideration
  //     // Collapsible content sections

  //     // 9. Quality Assurance Requirements

  //     // All schema properties must be complete (no undefined values)
  //     // Generate cryptographically secure UUIDs for all elements
  //     // Validate color contrast ratios meet accessibility standards
  //     // Ensure responsive behavior within specified dimensions

  //     // 10. Output Specifications

  //     // Return clean JSON array of IShape objects
  //     // No markdown formatting, comments, or explanations
  //     // Structure must be immediately parseable
  //     // Begin with [ and end with ] for direct JSON parsing

  //     // Pre-Processing Instructions
  //     // Before generating the interface:

  //     // Analyze the request for user intent and primary use case
  //     // Identify key user personas and their needs
  //     // Determine information priority and content hierarchy
  //     // Select appropriate design patterns for the specific use case
  //     // Consider accessibility requirements from the start
  //     // Plan responsive behavior across device types

  //     // Design Decision Framework
  //     // For each design choice, consider:

  //     // Does this enhance or hinder user task completion?
  //     // Is this consistent with established UI patterns?
  //     // Does this meet accessibility standards?
  //     // Is this scalable and maintainable?
  //     // Does this align with modern design best practices?

  //     // USER REQUEST:
  //     // ${input}

  //     // CRITICAL: Your response must be ONLY a valid JSON array starting with [ and ending with ]. No explanations, no markdown, no additional text.
  //     // `;

  //     const response = await axios.post("/api/chat", {
  //       messages: [
  //         // {
  //         //   role: "user",
  //         //   content: prompt,
  //         // },
  //       ],
  //     });

  //     // const assistantMessage = response.data.message;
  //     // console.log(JSON.parse(assistantMessage.content ?? "[]"), "array");

  //     // setShapes(
  //     //   JSON.parse(assistantMessage.content ?? "[]")?.map((e: IShape) => {
  //     //     return {
  //     //       id: e.id,
  //     //       pageId,
  //     //       parentId: e?.parentId,
  //     //       state: atom(e as IShape),
  //     //       tool: e?.tool as IKeyMethods,
  //     //     };
  //     //   })
  //     // );
  //     // setMessages((prev) => [...prev, assistantMessage]);
  //   } catch (error) {
  //     console.error("Error sending message:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <section
      className={
        "w-[360px] h-[140px] absolute bottom-0  m-4 p-2  border dark:border-gray-600 rounded-lg shadow-lg bg-muted"
      }
      style={{
        position: "absolute",
        bottom: 0,
      }}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "md",
          width: "100%",
          height: "100%",
        })}
      >
        <Input.withPause>
          <Input.TextArea
            value={text}
            placeholder="Write something..."
            onChange={(e) => setText(e)}
            style={{
              flex: 1,
              resize: "none",
            }}
          />
        </Input.withPause>

        <div className="w-full flex justify-end items-center">
          <button
            type="submit"
            disabled={mutate.isPending}
            className={css({
              padding: "md",
              backgroundColor: "primary",
              color: "white",
              borderRadius: "md",
              cursor: "pointer",
              opacity: mutate.isPending ? 0.7 : 1,
              "&:hover": {
                opacity: 0.9,
              },
              fontSize: "11px",
            })}
            onClick={() => {
              mutate.mutate();
            }}
          >
            {mutate.isPending ? (
              <Loading color={constants.theme.colors.white} />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

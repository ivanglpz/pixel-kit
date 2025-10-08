/* eslint-disable jsx-a11y/alt-text */
import { IShapesKeys } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import {
  Circle,
  Frame,
  Group,
  Image,
  MousePointer2,
  Pencil,
  Slash,
  Square,
  Type,
} from "lucide-react";

const size = 14;

export const icons = {
  cursor: (
    <MousePointer2
      size={size}
      className={css({
        stroke: "black",
        _dark: {
          stroke: "white",
        },
      })}
    />
  ),
  box: (
    <Square
      size={size}
      className={css({
        stroke: "black",
        _dark: {
          stroke: "white",
        },
      })}
    />
  ),
  frame: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M10.5 19.9V4.1C10.5 2.6 9.86 2 8.27 2H4.23C2.64 2 2 2.6 2 4.1V19.9C2 21.4 2.64 22 4.23 22H8.27C9.86 22 10.5 21.4 10.5 19.9Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 10.9V4.1C22 2.6 21.36 2 19.77 2H15.73C14.14 2 13.5 2.6 13.5 4.1V10.9C13.5 12.4 14.14 13 15.73 13H19.77C21.36 13 22 12.4 22 10.9Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 19.9V18.1C22 16.6 21.36 16 19.77 16H15.73C14.14 16 13.5 16.6 13.5 18.1V19.9C13.5 21.4 14.14 22 15.73 22H19.77C21.36 22 22 21.4 22 19.9Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  circle: (
    <Circle
      size={size}
      className={css({
        stroke: "black",
        _dark: {
          stroke: "white",
        },
      })}
    />
  ),
  line: (
    <Slash
      size={size}
      className={css({
        stroke: "black",
        _dark: {
          stroke: "white",
        },
      })}
    />
  ),
  image: (
    <Image
      size={size}
      className={css({
        stroke: "black",
        _dark: {
          stroke: "white",
        },
      })}
    />
  ),
  text: (
    <Type
      size={size}
      className={css({
        stroke: "black",
        _dark: {
          stroke: "white",
        },
      })}
    />
  ),
  peentool: (
    <Pencil
      size={size}
      className={css({
        stroke: "black",
        _dark: {
          stroke: "white",
        },
      })}
    />
  ),
  check: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 12L9.32824 17L18 7"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  grid_center: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2V22"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12H22"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  add: (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.875 8.12402H8.125V11.874H6.875V8.12402H3.125V6.87402H6.875V3.12402H8.125V6.87402H11.875V8.12402Z"
        fill="white"
      />
    </svg>
  ),
  group: (
    <Group
      size={size}
      className={css({
        stroke: "black",
        _dark: {
          stroke: "white",
        },
      })}
    />
  ),
  code: (
    <svg
      width={size}
      height={size}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.4976 5.87947C19.7618 5.95007 19.9871 6.1227 20.124 6.35941C20.2609 6.59612 20.2982 6.87752 20.2277 7.14172L14.7648 27.533C14.6939 27.7974 14.5208 28.0227 14.2837 28.1595C14.0466 28.2963 13.7649 28.3333 13.5005 28.2624C13.2361 28.1915 13.0107 28.0184 12.8739 27.7813C12.7372 27.5442 12.7001 27.2625 12.7711 26.9981L18.2353 6.60684C18.2704 6.47601 18.331 6.35337 18.4135 6.24593C18.496 6.13849 18.5988 6.04836 18.7162 5.98069C18.8335 5.91301 18.963 5.86912 19.0974 5.85152C19.2317 5.83391 19.3681 5.84295 19.499 5.87809L19.4976 5.87947ZM22.6078 10.076C22.6984 9.97512 22.808 9.89312 22.9303 9.83466C23.0526 9.7762 23.1852 9.74243 23.3206 9.73528C23.456 9.72813 23.5914 9.74774 23.7192 9.79299C23.847 9.83823 23.9646 9.90823 24.0653 9.99897L26.4537 12.1495C27.4671 13.0597 28.3058 13.816 28.8833 14.5007C29.4883 15.2226 29.9201 15.9967 29.9201 16.9537C29.9201 17.9093 29.4897 18.6835 28.8833 19.404C28.3058 20.0901 27.4671 20.8463 26.4537 21.7566L24.0653 23.9071C23.862 24.0902 23.5943 24.185 23.3211 24.1707C23.0479 24.1563 22.7916 24.0341 22.6085 23.8308C22.4254 23.6275 22.3306 23.3598 22.345 23.0866C22.3593 22.8134 22.4815 22.557 22.6848 22.374L25.0182 20.2743C26.1017 19.2995 26.8318 18.6381 27.3048 18.0771C27.7586 17.5367 27.8576 17.2218 27.8576 16.9523C27.8576 16.6842 27.7586 16.3693 27.3048 15.829C26.8318 15.2666 26.1017 14.6052 25.0182 13.6317L22.6848 11.5321C22.584 11.4415 22.502 11.3319 22.4435 11.2096C22.3851 11.0873 22.3513 10.9547 22.3441 10.8193C22.337 10.6839 22.3566 10.5485 22.4018 10.4207C22.4471 10.2929 22.5171 10.1767 22.6078 10.076ZM10.3153 11.5321C10.416 11.4414 10.4978 11.3319 10.5561 11.2096C10.6145 11.0873 10.6481 10.9548 10.6552 10.8195C10.6623 10.6842 10.6427 10.5489 10.5974 10.4212C10.5522 10.2935 10.4823 10.1759 10.3916 10.0753C10.301 9.97462 10.1914 9.89279 10.0691 9.83447C9.94687 9.77616 9.81432 9.7425 9.67904 9.73541C9.54376 9.72832 9.40841 9.74795 9.28072 9.79317C9.15303 9.8384 9.0355 9.90832 8.93483 9.99897L6.54645 12.1495C5.53308 13.0597 4.69433 13.816 4.11683 14.5007C3.51183 15.2226 3.08008 15.9967 3.08008 16.9537C3.08008 17.9093 3.51045 18.6835 4.11683 19.404C4.69433 20.0901 5.53308 20.8463 6.54645 21.7566L8.93483 23.9071C9.13813 24.0902 9.40583 24.185 9.67904 24.1707C9.95225 24.1563 10.2086 24.0341 10.3916 23.8308C10.5747 23.6275 10.6695 23.3598 10.6552 23.0866C10.6409 22.8134 10.5186 22.557 10.3153 22.374L7.98195 20.2743C6.89845 19.2995 6.16833 18.6381 5.69533 18.0771C5.24158 17.5367 5.14258 17.2218 5.14258 16.9523C5.14258 16.6842 5.24158 16.3693 5.69533 15.829C6.16833 15.2666 6.89845 14.6052 7.98195 13.6317L10.3153 11.5321Z"
        fill="white"
      />
    </svg>
  ),
  groupdrag: (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 3H3V5H5V3ZM19 7H21V13H19V9H9V19H13V21H7V7H19ZM7 3H9V5H7V3ZM5 7H3V9H5V7ZM3 11H5V13H3V11ZM5 15H3V17H5V15ZM11 3H13V5H11V3ZM17 3H15V5H17V3ZM15 17V15H21V17H19V19H17V21H15V17ZM19 19V21H21V19H19Z"
        fill="white"
      />
    </svg>
  ),
  clip: (
    <Frame
      size={size}
      className={css({
        stroke: "black",
        _dark: {
          stroke: "white",
        },
      })}
    />
  ),
};

export const iconsWithTools: { [key in IShapesKeys]: JSX.Element } = {
  FRAME: icons.box,
  // CIRCLE: icons.circle,
  DRAW: icons.peentool,
  // GROUP: icons.group,
  IMAGE: icons.image,
  TEXT: icons.text,
  // LINE: icons.line,
  // CLIP: icons.clip,
};

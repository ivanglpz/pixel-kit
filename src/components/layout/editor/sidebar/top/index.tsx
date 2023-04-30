import LogoHarmony from "@/components/icons/logo";
import { keyMethodAtom } from "@/editor/core/tools";
import { IKeyTool } from "@/editor/core/tools/types";
import { getRandomsColors } from "@/utils/randomColor";
import { useAtom } from "jotai";
import { AtomButton, AtomImage, AtomWrapper } from "lucy-nxtjs";
import { FC } from "react";

type Methods = {
  icon: string;
  keyMethod: IKeyTool;
};

const METHODS: Methods[] = [
  {
    icon: "https://res.cloudinary.com/whil/image/upload/v1682553024/app/harmony/CURSOR_pyjccq.svg",
    keyMethod: "MOVE",
  },
  {
    icon: "https://res.cloudinary.com/whil/image/upload/v1682651572/app/harmony/format-square_jidxxt.svg",
    keyMethod: "FRAME",
  },
  {
    icon: "https://res.cloudinary.com/whil/image/upload/v1682557163/app/harmony/BOX2_zeiaof.svg",
    keyMethod: "BOX",
  },
  {
    icon: "https://res.cloudinary.com/whil/image/upload/v1682555039/app/harmony/CIRCLE_cldn7a.svg",
    keyMethod: "CIRCLE",
  },
  {
    icon: "https://res.cloudinary.com/whil/image/upload/v1682648930/app/harmony/arrow-right_si9i3q.svg",
    keyMethod: "LINE",
  },
  {
    icon: "https://res.cloudinary.com/whil/image/upload/v1682650955/app/harmony/gallery_tzrhyx.svg",
    keyMethod: "IMAGE",
  },
  {
    icon: "https://res.cloudinary.com/whil/image/upload/v1682651016/app/harmony/text_xeiovb.svg",
    keyMethod: "TEXT",
  },
];

const colors = getRandomsColors(METHODS.length);

const LayoutEditorTop: FC = () => {
  const [method, setMethod] = useAtom(keyMethodAtom);

  return (
    <AtomWrapper
      customCSS={(css) => css`
        grid-column: 1 / 4;
        grid-row: 1;
        background-color: #292929;
        height: auto;
        padding: 1rem;
        border-bottom: 1px solid white;
        display: flex;
        flex-direction: row;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1em;
        z-index: 999999999999999999999;
      `}
    >
      <LogoHarmony color="white" width="45px" height="45px" />
      <AtomWrapper
        flexDirection="row"
        width="auto"
        gap="1em"
        alignItems="center"
        justifyContent="center"
      >
        {METHODS?.map((item, index) => {
          const isSelect = item.keyMethod === method;
          return (
            <AtomButton
              key={item.icon}
              customCSS={(css) => css`
                padding: 8px;
              `}
              backgroundColor={isSelect ? colors?.[index] : "none"}
              alignItems="center"
              justifyContent="center"
              isFocus={isSelect}
              onClick={() => setMethod(item.keyMethod)}
            >
              <AtomImage src={item.icon} width="25px" alt="" />
            </AtomButton>
          );
        })}
      </AtomWrapper>
    </AtomWrapper>
  );
};

export default LayoutEditorTop;
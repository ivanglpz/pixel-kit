/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { css } from "@stylespixelkit/css";
import Link from "next/link";

const modes = [
  {
    id: 1,
    label: "Image Editor",
    image: "/home/editorimages.png",
    tags: ["draw", "shapes", "images"],
    route: "/editor",
  },
  {
    id: 2,
    label: "Free Drawing",
    image: "/home/drawimages.png",
    tags: ["draw", "shapes", "images", "text"],
    route: "/draw",
  },
];

const Page = () => {
  return (
    <main
      className={css({
        padding: "xxlg",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        backgroundColor: "primary",
        height: "100%",
      })}
    >
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        })}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id="path-1-inside-1_865_433" fill="white">
            <path d="M43.5714 11H49V27.2857H43.5714V16.4286H16.4286V43.5714H27.2857V49H11V11H43.5714ZM32.7143 38.1429V32.7143H49V38.1429H43.5714V43.5714H38.1429V49H32.7143V38.1429ZM43.5714 43.5714V49H49V43.5714H43.5714Z" />
          </mask>
          <path
            d="M43.5714 11H49V27.2857H43.5714V16.4286H16.4286V43.5714H27.2857V49H11V11H43.5714ZM32.7143 38.1429V32.7143H49V38.1429H43.5714V43.5714H38.1429V49H32.7143V38.1429ZM43.5714 43.5714V49H49V43.5714H43.5714Z"
            fill="black"
          />
          <path
            d="M49 11H86V-26H49V11ZM49 27.2857V64.2857H86V27.2857H49ZM43.5714 27.2857H6.57143V64.2857H43.5714V27.2857ZM43.5714 16.4286H80.5714V-20.5714H43.5714V16.4286ZM16.4286 16.4286V-20.5714H-20.5714V16.4286H16.4286ZM16.4286 43.5714H-20.5714V80.5714H16.4286V43.5714ZM27.2857 43.5714H64.2857V6.57143H27.2857V43.5714ZM27.2857 49V86H64.2857V49H27.2857ZM11 49H-26V86H11V49ZM11 11V-26H-26V11H11ZM32.7143 32.7143V-4.28571H-4.28571V32.7143H32.7143ZM49 32.7143H86V-4.28571H49V32.7143ZM49 38.1429V75.1429H86V38.1429H49ZM43.5714 38.1429V1.14286H6.57143V38.1429H43.5714ZM38.1429 43.5714V6.57143H1.14286V43.5714H38.1429ZM38.1429 49V86H75.1429V49H38.1429ZM32.7143 49H-4.28571V86H32.7143V49ZM43.5714 49H6.57143V86H43.5714V49ZM49 49V86H86V49H49ZM49 43.5714H86V6.57143H49V43.5714ZM43.5714 48H49V-26H43.5714V48ZM12 11V27.2857H86V11H12ZM49 -9.71429H43.5714V64.2857H49V-9.71429ZM80.5714 27.2857V16.4286H6.57143V27.2857H80.5714ZM43.5714 -20.5714H16.4286V53.4286H43.5714V-20.5714ZM-20.5714 16.4286V43.5714H53.4286V16.4286H-20.5714ZM16.4286 80.5714H27.2857V6.57143H16.4286V80.5714ZM-9.71429 43.5714V49H64.2857V43.5714H-9.71429ZM27.2857 12H11V86H27.2857V12ZM48 49V11H-26V49H48ZM11 48H43.5714V-26H11V48ZM69.7143 38.1429V32.7143H-4.28571V38.1429H69.7143ZM32.7143 69.7143H49V-4.28571H32.7143V69.7143ZM12 32.7143V38.1429H86V32.7143H12ZM49 1.14286H43.5714V75.1429H49V1.14286ZM6.57143 38.1429V43.5714H80.5714V38.1429H6.57143ZM43.5714 6.57143H38.1429V80.5714H43.5714V6.57143ZM1.14286 43.5714V49H75.1429V43.5714H1.14286ZM38.1429 12H32.7143V86H38.1429V12ZM69.7143 49V38.1429H-4.28571V49H69.7143ZM6.57143 43.5714V49H80.5714V43.5714H6.57143ZM43.5714 86H49V12H43.5714V86ZM86 49V43.5714H12V49H86ZM49 6.57143H43.5714V80.5714H49V6.57143Z"
            fill="white"
            mask="url(#path-1-inside-1_865_433)"
          />
        </svg>
        <p
          className={css({
            color: "text",
            fontWeight: "bold",
            fontSize: "lg",
          })}
        >
          Pixel Kit
        </p>
      </section>
      <section>
        <p
          className={css({
            color: "text",
            fontSize: "md",
            opacity: 0.7,
          })}
        >
          You have {modes.length} modes available of edition, In the future
          there will be more modes.
        </p>
      </section>
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "100%",
          gap: "lg",
        })}
      >
        {modes.map((e) => (
          <Link
            href={e.route}
            key={`pixel-kit-modes-${e?.id}`}
            className={css({
              display: "flex",
              flexDirection: "column",
              maxHeight: 260,
              backgroundColor: "#04080c",
              border: "1px solid #464646",
              borderRadius: "md",
              padding: "lg",
              _hover: {
                border: "1px solid #949494",
              },
            })}
          >
            <div
              className={css({
                height: 200,
                width: 320,
              })}
            >
              <img
                src={e.image}
                alt={e?.label}
                className={css({
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                })}
              />
            </div>
            <div
              className={css({
                display: "flex",
                flexDirection: "column",
                gap: "md",
              })}
            >
              <p
                className={css({
                  color: "text",
                  fontWeight: "bold",
                })}
              >
                {e?.label}
              </p>
              <div
                className={css({
                  display: "flex",
                  flexDirection: "row",
                  gap: "sm",
                })}
              >
                {e?.tags?.map((e) => (
                  <p
                    key={`tag-pixel-kit-${e}`}
                    className={css({
                      color: "text",
                      display: "flex",

                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: "#464646",
                      borderRadius: "md",
                      padding: "md",
                      textAlign: "center",
                      fontSize: "sm",
                    })}
                  >
                    {e}
                  </p>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};
export default Page;

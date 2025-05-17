/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import SeoComponent from "@/components/seo";
import ComponentApp from "@/editor";
import { css } from "@stylespixelkit/css";
import Link from "next/link";
import { useRouter } from "next/router";

const modes = [
  {
    id: 1,
    label: "Image Editor",
    image:
      "https://res.cloudinary.com/whil/image/upload/v1712285934/app/pixel-kit/images/ejhubphvcmnj5duxiyna.png",
    tags: ["draw", "shapes", "images"],
    route: "/editor",
  },
  {
    id: 2,
    label: "Free Drawing",
    image:
      "https://res.cloudinary.com/whil/image/upload/v1712285934/app/pixel-kit/images/mlaf3hmbnhsdk8go034a.png",
    tags: ["draw", "shapes", "images", "text"],
    route: "/draw",
  },
];
const features = [
  {
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="0.5" width="39" height="39" rx="3.5" fill="#242727" />
        <rect
          x="0.5"
          y="0.5"
          width="39"
          height="39"
          rx="3.5"
          stroke="#555555"
        />
        <path
          d="M20 30C18.6868 30 17.3864 29.7413 16.1732 29.2388C14.9599 28.7362 13.8575 27.9997 12.9289 27.0711C11.0536 25.1957 10 22.6522 10 20C10 17.3478 11.0536 14.8043 12.9289 12.9289C14.8043 11.0536 17.3478 10 20 10C25.5 10 30 14 30 19C30 20.5913 29.3679 22.1174 28.2426 23.2426C27.1174 24.3679 25.5913 25 24 25H22.2C21.9 25 21.7 25.2 21.7 25.5C21.7 25.6 21.8 25.7 21.8 25.8C22.2 26.3 22.4 26.9 22.4 27.5C22.5 28.9 21.4 30 20 30ZM20 12C17.8783 12 15.8434 12.8429 14.3431 14.3431C12.8429 15.8434 12 17.8783 12 20C12 22.1217 12.8429 24.1566 14.3431 25.6569C15.8434 27.1571 17.8783 28 20 28C20.3 28 20.5 27.8 20.5 27.5C20.5 27.3 20.4 27.2 20.4 27.1C20 26.6 19.8 26.1 19.8 25.5C19.8 24.1 20.9 23 22.3 23H24C25.0609 23 26.0783 22.5786 26.8284 21.8284C27.5786 21.0783 28 20.0609 28 19C28 15.1 24.4 12 20 12ZM14.5 18C15.3 18 16 18.7 16 19.5C16 20.3 15.3 21 14.5 21C13.7 21 13 20.3 13 19.5C13 18.7 13.7 18 14.5 18ZM17.5 14C18.3 14 19 14.7 19 15.5C19 16.3 18.3 17 17.5 17C16.7 17 16 16.3 16 15.5C16 14.7 16.7 14 17.5 14ZM22.5 14C23.3 14 24 14.7 24 15.5C24 16.3 23.3 17 22.5 17C21.7 17 21 16.3 21 15.5C21 14.7 21.7 14 22.5 14ZM25.5 18C26.3 18 27 18.7 27 19.5C27 20.3 26.3 21 25.5 21C24.7 21 24 20.3 24 19.5C24 18.7 24.7 18 25.5 18Z"
          fill="white"
        />
      </svg>
    ),
    title: "Shapes",
    description:
      "You have the fundamental shapes: Boxes, Circles, Texts, Images.",
  },
  {
    icon: (
      <svg
        width="41"
        height="40"
        viewBox="0 0 41 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="1.25" y="0.5" width="39" height="39" rx="3.5" fill="#242727" />
        <rect
          x="1.25"
          y="0.5"
          width="39"
          height="39"
          rx="3.5"
          stroke="#555555"
        />
        <path
          d="M27.9375 18.75V26.25C27.9375 26.6644 27.7729 27.0618 27.4799 27.3549C27.1868 27.6479 26.7894 27.8125 26.375 27.8125H15.125C14.7106 27.8125 14.3132 27.6479 14.0201 27.3549C13.7271 27.0618 13.5625 26.6644 13.5625 26.25V18.75C13.5625 18.3356 13.7271 17.9382 14.0201 17.6452C14.3132 17.3521 14.7106 17.1875 15.125 17.1875H17C17.2486 17.1875 17.4871 17.2863 17.6629 17.4621C17.8387 17.6379 17.9375 17.8764 17.9375 18.125C17.9375 18.3736 17.8387 18.6121 17.6629 18.7879C17.4871 18.9637 17.2486 19.0625 17 19.0625H15.4375V25.9375H26.0625V19.0625H24.5C24.2514 19.0625 24.0129 18.9637 23.8371 18.7879C23.6613 18.6121 23.5625 18.3736 23.5625 18.125C23.5625 17.8764 23.6613 17.6379 23.8371 17.4621C24.0129 17.2863 24.2514 17.1875 24.5 17.1875H26.375C26.7894 17.1875 27.1868 17.3521 27.4799 17.6452C27.7729 17.9382 27.9375 18.3356 27.9375 18.75ZM18.2883 15.6633L19.8125 14.1406V20.625C19.8125 20.8736 19.9113 21.1121 20.0871 21.2879C20.2629 21.4637 20.5014 21.5625 20.75 21.5625C20.9986 21.5625 21.2371 21.4637 21.4129 21.2879C21.5887 21.1121 21.6875 20.8736 21.6875 20.625V14.1406L23.2117 15.6656C23.2989 15.7528 23.4025 15.822 23.5164 15.8692C23.6303 15.9164 23.7525 15.9407 23.8758 15.9407C23.9991 15.9407 24.1212 15.9164 24.2352 15.8692C24.3491 15.822 24.4526 15.7528 24.5398 15.6656C24.627 15.5784 24.6962 15.4749 24.7434 15.361C24.7906 15.247 24.8149 15.1249 24.8149 15.0016C24.8149 14.8782 24.7906 14.7561 24.7434 14.6422C24.6962 14.5282 24.627 14.4247 24.5398 14.3375L21.4148 11.2125C21.3277 11.1251 21.2243 11.0558 21.1103 11.0084C20.9963 10.9611 20.8742 10.9368 20.7508 10.9368C20.6274 10.9368 20.5052 10.9611 20.3913 11.0084C20.2773 11.0558 20.1738 11.1251 20.0867 11.2125L16.9617 14.3375C16.8745 14.4247 16.8053 14.5282 16.7581 14.6422C16.7109 14.7561 16.6867 14.8782 16.6867 15.0016C16.6867 15.2506 16.7856 15.4895 16.9617 15.6656C17.1378 15.8418 17.3767 15.9407 17.6258 15.9407C17.8749 15.9407 18.1137 15.8418 18.2898 15.6656L18.2883 15.6633Z"
          fill="white"
        />
      </svg>
    ),
    title: "Export",
    description:
      "Export your edits in various formats: images, files, and more",
  },
  {
    icon: (
      <svg
        width="41"
        height="40"
        viewBox="0 0 41 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="1" y="0.5" width="39" height="39" rx="3.5" fill="#242727" />
        <rect x="1" y="0.5" width="39" height="39" rx="3.5" stroke="#555555" />
        <path
          d="M20.5 28.3333C25.1024 28.3333 28.8333 24.6023 28.8333 20C28.8333 15.3976 25.1024 11.6666 20.5 11.6666C15.8976 11.6666 12.1667 15.3976 12.1667 20C12.1667 24.6023 15.8976 28.3333 20.5 28.3333Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.1667 21.6667C17.1667 21.6667 18.4167 23.3333 20.5 23.3333C22.5833 23.3333 23.8333 21.6667 23.8333 21.6667M18 17.5H18.0083M23 17.5H23.0083"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    title: "Icons",
    description: "You have a large catalog of icons to include in your edits.",
  },
  {
    icon: (
      <svg
        width="41"
        height="40"
        viewBox="0 0 41 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.75" y="0.5" width="39" height="39" rx="3.5" fill="#242727" />
        <rect
          x="0.75"
          y="0.5"
          width="39"
          height="39"
          rx="3.5"
          stroke="#555555"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.3676 10C15.411 10.0001 16.4248 10.3469 17.2497 10.9857C18.0747 11.6245 18.6641 12.5193 18.9253 13.5294H28.4853V15.8824H18.9253C18.6362 16.9888 17.9543 17.9522 17.0068 18.5927C16.0594 19.2332 14.9113 19.5069 13.7768 19.3629C12.6423 19.2188 11.599 18.6667 10.8418 17.8097C10.0845 16.9528 9.66509 15.8495 9.66176 14.7059C9.66176 13.4578 10.1576 12.2608 11.0401 11.3783C11.9226 10.4958 13.1196 10 14.3676 10ZM14.3676 17.0588C14.9917 17.0588 15.5902 16.8109 16.0314 16.3697C16.4727 15.9284 16.7206 15.3299 16.7206 14.7059C16.7206 14.0818 16.4727 13.4834 16.0314 13.0421C15.5902 12.6008 14.9917 12.3529 14.3676 12.3529C13.7436 12.3529 13.1451 12.6008 12.7039 13.0421C12.2626 13.4834 12.0147 14.0818 12.0147 14.7059C12.0147 15.3299 12.2626 15.9284 12.7039 16.3697C13.1451 16.8109 13.7436 17.0588 14.3676 17.0588ZM26.1323 30C25.089 29.9999 24.0752 29.6531 23.2503 29.0143C22.4253 28.3755 21.8359 27.4807 21.5747 26.4706H12.0147V24.1176H21.5747C21.8638 23.0112 22.5457 22.0478 23.4931 21.4073C24.4406 20.7668 25.5887 20.4931 26.7232 20.6371C27.8577 20.7812 28.901 21.3333 29.6582 22.1903C30.4154 23.0472 30.8349 24.1505 30.8382 25.2941C30.8382 26.5422 30.3424 27.7392 29.4599 28.6217C28.5774 29.5042 27.3804 30 26.1323 30ZM26.1323 27.6471C26.7564 27.6471 27.3549 27.3992 27.7961 26.9579C28.2374 26.5166 28.4853 25.9182 28.4853 25.2941C28.4853 24.6701 28.2374 24.0716 27.7961 23.6303C27.3549 23.1891 26.7564 22.9412 26.1323 22.9412C25.5083 22.9412 24.9098 23.1891 24.4686 23.6303C24.0273 24.0716 23.7794 24.6701 23.7794 25.2941C23.7794 25.9182 24.0273 26.5166 24.4686 26.9579C24.9098 27.3992 25.5083 27.6471 26.1323 27.6471Z"
          fill="white"
        />
      </svg>
    ),
    title: "Modes",
    description: "Different types of editing. according to your needs.",
  },
];

export const Logo = () => {
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "md",
        width: "auto",
      })}
    >
      <svg
        width="34"
        height="35"
        viewBox="0 0 34 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.5" y="1" width="33" height="33" rx="3.5" fill="#252727" />
        <rect x="0.5" y="1" width="33" height="33" rx="3.5" stroke="#555555" />
        <mask
          id="mask0_50_334"
          style={{
            maskType: "luminance",
          }}
          maskUnits="userSpaceOnUse"
          x="10"
          y="10"
          width="14"
          height="15"
        >
          <path
            d="M22 10.5H24V16.5H22V12.5H12V22.5H16V24.5H10V10.5H22ZM18 20.5V18.5H24V20.5H22V22.5H20V24.5H18V20.5ZM22 22.5V24.5H24V22.5H22Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_50_334)">
          <path
            d="M24 10.5H37.6316V-3.13159H24V10.5ZM24 16.5V30.1316H37.6316V16.5H24ZM22 16.5H8.36841V30.1316H22V16.5ZM22 12.5H35.6316V-1.13158H22V12.5ZM12 12.5V-1.13158H-1.63158V12.5H12ZM12 22.5H-1.63158V36.1316H12V22.5ZM16 22.5H29.6316V8.86841H16V22.5ZM16 24.5V38.1316H29.6316V24.5H16ZM9.99999 24.5H-3.63159V38.1316H9.99999V24.5ZM9.99999 10.5V-3.13159H-3.63159V10.5H9.99999ZM18 18.5V4.86841H4.36841V18.5H18ZM24 18.5H37.6316V4.86841H24V18.5ZM24 20.5V34.1316H37.6316V20.5H24ZM22 20.5V6.86841H8.36841V20.5H22ZM20 22.5V8.86841H6.36841V22.5H20ZM20 24.5V38.1316H33.6316V24.5H20ZM18 24.5H4.36841V38.1316H18V24.5ZM22 24.5H8.36841V38.1316H22V24.5ZM24 24.5V38.1316H37.6316V24.5H24ZM24 22.5H37.6316V8.86841H24V22.5ZM22 24.1316H24V-3.13159H22V24.1316ZM10.3684 10.5V16.5H37.6316V10.5H10.3684ZM24 2.86841H22V30.1316H24V2.86841ZM35.6316 16.5V12.5H8.36841V16.5H35.6316ZM22 -1.13158H12V26.1316H22V-1.13158ZM-1.63158 12.5V22.5H25.6316V12.5H-1.63158ZM12 36.1316H16V8.86841H12V36.1316ZM2.36841 22.5V24.5H29.6316V22.5H2.36841ZM16 10.8684H9.99999V38.1316H16V10.8684ZM23.6316 24.5V10.5H-3.63159V24.5H23.6316ZM9.99999 24.1316H22V-3.13159H9.99999V24.1316ZM31.6316 20.5V18.5H4.36841V20.5H31.6316ZM18 32.1316H24V4.86841H18V32.1316ZM10.3684 18.5V20.5H37.6316V18.5H10.3684ZM24 6.86841H22V34.1316H24V6.86841ZM8.36841 20.5V22.5H35.6316V20.5H8.36841ZM22 8.86841H20V36.1316H22V8.86841ZM6.36841 22.5V24.5H33.6316V22.5H6.36841ZM20 10.8684H18V38.1316H20V10.8684ZM31.6316 24.5V20.5H4.36841V24.5H31.6316ZM8.36841 22.5V24.5H35.6316V22.5H8.36841ZM22 38.1316H24V10.8684H22V38.1316ZM37.6316 24.5V22.5H10.3684V24.5H37.6316ZM24 8.86841H22V36.1316H24V8.86841Z"
            fill="white"
          />
        </g>
      </svg>
      <p
        className={css({
          color: "text",
          fontWeight: "bold",
        })}
      >
        Pixel Kit
      </p>
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  return (
    <main
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        backgroundColor: "primary",
        width: "100%",
        alignItems: "center",
        overflowY: "scroll",
      })}
    >
      <SeoComponent
        image="https://res.cloudinary.com/whil/image/upload/v1712286761/app/pixel-kit/images/eeackp0gyfsgatxd5htg.png"
        title="Pixel Kit Editing Tools"
        content="Edit, Enhance, Photos, Pixel Kit, Photo editing app, User-friendly interface, Advanced filters, Powerful editing tools, Transform, Retouch, Customize, Download, Unleash your creativity"
        description="Edit and enhance your photos with Pixel Kit. Elevate your images with our user-friendly interface and powerful editing tools."
        url="https://pixel-kit.vercel.app/"
      />
      <div
        className={css({
          maxWidth: "1440px",
          width: "100%",
          gap: "xxxlg",
          display: "flex",
          flexDirection: "column",
          padding: "0px 30px",
        })}
      >
        <section
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "xxlg",
            marginTop: "15%",
          })}
        >
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "lg",
            })}
          >
            <Logo />
            <h1
              className={css({
                color: "text",
                fontWeight: "bold",
                fontSize: "36px",
                textAlign: "center",
                "@media(max-width:623px)": {
                  fontSize: "26px",
                },
                "@media(max-width:375px)": {
                  fontSize: "22px",
                },
                "@media(max-width:320px)": {
                  fontSize: "18px",
                },
              })}
            >
              Elevate your images with our user-friendly <br /> interface and
              powerful editing tools.
            </h1>
            <button
              className={css({
                backgroundColor: "white",
                padding: "10px 20px",
                borderRadius: "lg",
                fontWeight: "bold",
                cursor: "pointer",
              })}
              onClick={() => router.push("/editor")}
            >
              Get Started
            </button>
          </div>
          <div
            className={css({
              position: "relative",
              maxWidth: "100%",
              width: "100%",
              height: 720,
            })}
          >
            <ComponentApp />
          </div>
        </section>
        <section
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "xxxlg",
          })}
        >
          <h2
            className={css({
              color: "text",
              fontWeight: "bold",
              fontSize: "24px",
              width: "auto",
            })}
          >
            Modes
          </h2>
          <div
            className={css({
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "lg",
            })}
          >
            {modes?.map((e) => (
              <Link
                href={e.route}
                key={`mode-${e.label}-${e.id}`}
                className={css({
                  backgroundColor: "#191A1A",
                  padding: "lg",
                  border: "1px solid #3F3F3F",
                  borderRadius: "lg",
                  width: "300px",
                  height: "auto",
                  gap: "lg",
                  display: "flex",
                  flexDirection: "column",
                  "@media(max-width:672px)": {
                    flexGrow: 1,
                  },
                })}
              >
                <img
                  src={e?.image}
                  alt={e?.label}
                  className={css({
                    width: "100%",
                    height: "160px",
                    objectFit: "contain",
                    borderRadius: 4,
                    backgroundColor: "#F0F0F0",
                  })}
                />
                <p
                  className={css({
                    color: "text",
                    width: "auto",
                    fontWeight: "bold",
                  })}
                >
                  {e?.label}
                </p>
                <p
                  className={css({
                    color: "text",
                    width: "auto",
                    opacity: 0.7,
                  })}
                >
                  {e?.tags?.join(", ")}
                </p>
              </Link>
            ))}
          </div>
        </section>
        <section
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "xxxlg",
          })}
        >
          <h3
            className={css({
              color: "text",
              fontWeight: "bold",
              fontSize: "24px",
              width: "auto",
            })}
          >
            Features
          </h3>
          <div
            className={css({
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "lg",
            })}
          >
            {features.map((e) => (
              <article
                key={`feature-${e?.title}`}
                className={css({
                  backgroundColor: "#191A1A",
                  padding: "lg",
                  border: "1px solid #3F3F3F",
                  borderRadius: "lg",
                  width: "300px",
                  height: "220px",
                  gap: "lg",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  flexGrow: 1,
                })}
              >
                {e?.icon}
                <p
                  className={css({
                    color: "text",
                    fontWeight: "bold",
                  })}
                >
                  {e?.title}
                </p>
                <p
                  className={css({
                    color: "text",
                    opacity: 0.7,
                  })}
                >
                  {e?.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
      <footer
        className={css({
          backgroundColor: "#191A1A",
          minHeight: "250px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: "xxlg",
          marginTop: "45px",
        })}
      >
        <div
          className={css({
            maxWidth: "1440px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: "0px 30px",
            gap: "xlg",
          })}
        >
          <section
            className={css({
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "lg",
              flexGrow: 1,
            })}
          >
            <Logo />
            <p
              className={css({
                color: "text",
                opacity: 0.5,
              })}
            >
              Unleash your creativity with our high-quality image editing.
            </p>
            <p
              className={css({
                color: "text",
                opacity: 0.8,
              })}
            >
              © {new Date().getFullYear()} A division of Ivan Garcia. All
              rights reserved
            </p>
          </section>
          <section
            className={css({
              display: "flex",
              flexDirection: "row",
              gap: "lg",
              alignItems: "flex-end",
            })}
          >
            <Link href="https://twitter.com/ivanglpz" target="_blank">
              <svg
                width="28"
                height="26"
                viewBox="0 0 28 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.0512 0H26.3445L16.9645 11.0146L28 26H19.3597L12.593 16.9102L4.84867 26H0.553L10.5863 14.2183L0 0.0011986H8.85967L14.9765 8.3095L22.0512 0ZM20.545 23.3608H22.9238L7.567 2.50136H5.01433L20.545 23.3608Z"
                  fill="white"
                />
              </svg>
            </Link>
            <Link href="https://www.linkedin.com/in/ivanglpz/" target="_blank">
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.1111 0C23.8773 0 24.6121 0.304364 25.1539 0.846136C25.6956 1.38791 26 2.12271 26 2.88889V23.1111C26 23.8773 25.6956 24.6121 25.1539 25.1539C24.6121 25.6956 23.8773 26 23.1111 26H2.88889C2.12271 26 1.38791 25.6956 0.846136 25.1539C0.304364 24.6121 0 23.8773 0 23.1111V2.88889C0 2.12271 0.304364 1.38791 0.846136 0.846136C1.38791 0.304364 2.12271 0 2.88889 0H23.1111ZM22.3889 22.3889V14.7333C22.3889 13.4845 21.8928 12.2867 21.0097 11.4036C20.1266 10.5206 18.9289 10.0244 17.68 10.0244C16.4522 10.0244 15.0222 10.7756 14.3289 11.9022V10.2989H10.2989V22.3889H14.3289V15.2678C14.3289 14.1556 15.2244 13.2456 16.3367 13.2456C16.873 13.2456 17.3874 13.4586 17.7666 13.8379C18.1458 14.2171 18.3589 14.7315 18.3589 15.2678V22.3889H22.3889ZM5.60444 8.03111C6.24804 8.03111 6.86527 7.77545 7.32036 7.32036C7.77545 6.86527 8.03111 6.24804 8.03111 5.60444C8.03111 4.26111 6.94778 3.16333 5.60444 3.16333C4.95702 3.16333 4.33612 3.42052 3.87832 3.87832C3.42052 4.33612 3.16333 4.95702 3.16333 5.60444C3.16333 6.94778 4.26111 8.03111 5.60444 8.03111ZM7.61222 22.3889V10.2989H3.61111V22.3889H7.61222Z"
                  fill="white"
                />
              </svg>
            </Link>
          </section>
        </div>
      </footer>
    </main>
  );
};
export default Page;

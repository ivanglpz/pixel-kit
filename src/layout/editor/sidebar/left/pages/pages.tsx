import usePages from "@/editor/core/hooks/pages/hook";
import icons from "@/assets/index";
import { css } from "@stylespixelkit/css";

const PagesComponent = () => {
  const { pages, handleSelectPage, page, handleCreatePage } = usePages();

  return (
    <div
      className={css({
        padding: "lg",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        backgroundColor: "primary",
        borderRadius: "lg",
        border: "container",
      })}
    >
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <p
          className={css({
            fontSize: "md",
            color: "text",
            fontWeight: "bold",
          })}
        >
          Pages
        </p>

        <button
          onClick={handleCreatePage}
          className={css({
            backgroundGradient: "primary",
            padding: "md",
            borderRadius: "md",
            border: "container",
          })}
        >
          {icons.add}
        </button>
      </section>
      <section
        className={` ${css({
          height: "100%",
          maxHeight: "10rem",
          overflow: "hidden",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 4,
          _hover: {
            overflowY: "scroll",
          },
        })}  scrollbar_container`}
      >
        {pages.map((item, index) => (
          <button
            key={`pages-section-item-${item.id}`}
            className={css({
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: page === item.id ? "secondary" : "container",
              borderRadius: "md",
              padding: "md",
            })}
            onClick={() => {
              handleSelectPage(item.id);
            }}
          >
            <p
              className={css({
                color: "text",
                fontSize: "sm",
                opacity: page === item.id ? 1 : 0.5,
              })}
            >
              Page {index + 1}
            </p>
          </button>
        ))}
      </section>
    </div>
  );
};

export default PagesComponent;

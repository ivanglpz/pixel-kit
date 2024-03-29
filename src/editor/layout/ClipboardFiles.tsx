import { css } from "@stylespixelkit/css";

export const ClipboardFiles = () => {
  return (
    <div
      className={css({
        position: "absolute",
        bottom: 5,
      })}
    >
      <div
        className={css({
          padding: "lg",
          zIndex: 9,
          backgroundColor: "primary",
          display: "flex",
          flexDirection: "column",
          borderRadius: "lg",
          gap: "md",
          border: "container",
          maxHeight: "10rem",
          width: "100%",
          maxWidth: "22rem",
        })}
      >
        <section
          className={css({
            display: "flex",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <p
            className={css({
              color: "text",
              fontWeight: "bold",
              fontSize: "smaller",
            })}
          >
            Clipboard Files
          </p>
        </section>
        <div
          className={`${css({
            height: "100%",
            width: "100%",
            overflow: "hidden",
            overflowX: "hidden",
            display: "flex",
            flexDirection: "row",
            gap: 4,
            _hover: {
              overflowX: "scroll",
            },
          })}  scrollbar_container`}
        >
          {Array.from({ length: 50 })?.map((e, index) => (
            <div
              key={`files-queue-${index}`}
              className={css({
                height: "7rem",
                width: "10rem",
              })}
            >
              <div
                key={`files-queue-${index}`}
                className={css({
                  height: "7rem",
                  width: "10rem",
                  backgroundColor: "red",
                })}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

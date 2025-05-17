import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { useImageRender } from "@/editor/hooks/useImageRender";
import { css } from "@stylespixelkit/css";
import { ChangeEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export const ImageConfiguration = () => {
  const { img, handleSetImageRender } = useImageRender();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const url =
      "https://res.cloudinary.com/whil/image/upload/fl_preserve_transparency/v1747523035/app/pixel-kit/images/vki9p3syvur8bsjczld6.jpg?_s=public-apps";

    const loadImageFromURL = async () => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;

          const image = new Image();
          image.onload = () => {
            handleSetImageRender({
              base64,
              name: "default-image.jpg",
              height: image.height,
              width: image.width,
              x: 0,
              y: 0,
            });
          };
          image.src = base64;
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Failed to load default image:", error);
      }
    };

    loadImageFromURL();
  }, []);

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.onload = () => {
        handleSetImageRender({
          base64: reader?.result as string,
          name: file.name,
          height: image.height,
          width: image.width,
          x: 0,
          y: 0,
        });
      };

      if (inputRef.current) {
        inputRef.current.value = "";
      }
      image.src = reader?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const Container = document.getElementById("pixel-app");

  return (
    <>
      <Valid isValid={!Boolean(img?.base64?.length)}>
        {Container
          ? createPortal(
              <main
                className={css({
                  position: "absolute",
                  top: 0,
                  zIndex: 9999,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                <section
                  className={css({
                    padding: "lg",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "lg",
                    backgroundColor: "primary",
                    borderRadius: "lg",
                    border: "container",
                    width: 280,
                    height: 220,
                  })}
                >
                  <div
                    className={css({
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "lg",
                    })}
                  >
                    <p
                      className={css({
                        fontSize: "md",
                        color: "text",
                        fontWeight: "bold",
                      })}
                    >
                      Image editing mode.
                    </p>
                    <p
                      className={css({
                        fontSize: "sm",
                        color: "text",
                        fontWeight: "normal",
                        opacity: 0.7,
                      })}
                    >
                      Please upload an image for editing before proceeding.
                    </p>
                  </div>
                  <Button
                    text="Upload Image"
                    onClick={() => inputRef.current?.click()}
                  />
                  {img?.name ? (
                    <p
                      className={css({
                        fontSize: "x-small",
                        color: "text",
                        fontWeight: "normal",
                        fontStyle: "italic",
                        opacity: 0.7,
                      })}
                    >
                      {img?.name}
                    </p>
                  ) : null}
                </section>
              </main>,
              Container
            )
          : null}
      </Valid>
      <Button text="Change Image" onClick={() => inputRef.current?.click()} />
      <input
        ref={inputRef}
        type="file"
        color="white"
        accept="image/*"
        onChange={handleFiles}
        className={css({
          backgroundColor: "red",
          width: 0,
          height: 0,
          display: "none",
        })}
      />
    </>
  );
};

import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { useImageRender } from "@/editor/hooks/image/hook";
import { css } from "@stylespixelkit/css";
import { ChangeEvent, useRef } from "react";
import { createPortal } from "react-dom";

export const ImageConfiguration = () => {
  const { img, handleSetImageRender } = useImageRender();

  const inputRef = useRef<HTMLInputElement>(null);
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
  return (
    <>
      <Valid isValid={!Boolean(img?.base64?.length)}>
        {createPortal(
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
            <div
              className={css({
                padding: "lg",
                display: "flex",
                flexDirection: "column",
                gap: "lg",
                backgroundColor: "primary",
                borderRadius: "lg",
                border: "container",
                width: 200,
                height: 130,
              })}
            >
              <p
                className={css({
                  fontSize: "md",
                  color: "text",
                  fontWeight: "bold",
                })}
              >
                Please enter a image
              </p>
              <p
                className={css({
                  fontSize: "sm",
                  color: "text",
                  fontWeight: "normal",
                  opacity: 0.7,
                })}
              >
                Only accept images...
              </p>
              <Button
                text="Browser Files"
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
            </div>
          </main>,
          document.body
        )}
      </Valid>
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
        <p
          className={css({
            fontSize: "md",
            color: "text",
            fontWeight: "bold",
          })}
        >
          Files
        </p>
        <p
          className={css({
            fontSize: "sm",
            color: "text",
            fontWeight: "normal",
            opacity: 0.7,
          })}
        >
          Only accept images...
        </p>
        <Button
          text="Browser Files"
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
          })}
        />
      </div>
    </>
  );
};

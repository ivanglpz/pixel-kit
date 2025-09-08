/* eslint-disable react-hooks/exhaustive-deps */
import { Valid } from "@/components/valid";
import { Button } from "@/editor/components/button";
import { css } from "@stylespixelkit/css";
import { useAtomValue, useSetAtom } from "jotai";
import { ChangeEvent, useRef } from "react";
import { createPortal } from "react-dom";
import { IMAGE_RENDER_ATOM, SET_EDIT_IMAGE } from "../states/image";

export const ImageConfiguration = () => {
  const setImage = useSetAtom(SET_EDIT_IMAGE);
  const img = useAtomValue(IMAGE_RENDER_ATOM);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Convertir archivo a base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("FileReader result is not a string"));
          }
        };
        reader.onerror = () => reject(new Error("Error reading file"));
        reader.readAsDataURL(file);
      });

      // Crear objeto Image para obtener dimensiones
      const { width, height } = await new Promise<{
        width: number;
        height: number;
      }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error("Error loading image"));
        img.src = base64;
      });

      // Setear en jotai
      setImage({
        base64,
        name: file.name,
        width,
        height,
        x: 0,
        y: 0,
      });
    } catch (error) {
      console.error("Error loading image:", error);
    } finally {
      // Resetear input
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
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
                    backgroundColor: "bg",
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
      <button
        className={css({
          padding: "md",
          borderColor: "border",
          borderWidth: 1,
          borderRadius: "md",
          backgroundColor: "gray.800",
          py: "5",
          px: "10",
          height: "35px",
        })}
        onClick={() => inputRef.current?.click()}
      >
        <p
          className={css({
            fontSize: "sm",
          })}
        >
          Change
        </p>
      </button>
      <input
        ref={inputRef}
        type="file"
        color="white"
        accept="image/*"
        onChange={handleFiles}
        className={css({
          width: 0,
          height: 0,
          display: "none",
        })}
      />
    </>
  );
};

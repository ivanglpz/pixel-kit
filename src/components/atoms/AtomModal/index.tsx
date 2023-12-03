/* eslint-disable react/no-unescaped-entities */
import isBrave from "@/utils/browser/browser";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { css } from "../../../../styled-system/css";

export const mountAtom = atomWithStorage("modal-browser-fingerprint", true);

const WarningBrowserBraveModal = () => {
  const [mounted, setMounted] = useAtom(mountAtom);
  const [isBrowserWithFingerprint, setBrowserWithFingerprint] = useState(false);

  useEffect(() => {
    setBrowserWithFingerprint(isBrave());
  }, []);

  return isBrowserWithFingerprint && mounted ? (
    <div
      className={css({
        position: "absolute",
        height: "100vh",
        width: "100%",
        zIndex: 999999938,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        background: "rgba(0, 0, 0, 0.25)",
      })}
    >
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "auto auto",
          backgroundColor: "#242424",
          padding: "4",
          gap: "4",
          borderRadius: "12px",
        })}
      >
        <section>
          <Image
            src={"/warningbrave.png"}
            height={400}
            width={320}
            alt="warning-brave-fingerprint"
            className={css({
              width: "100%",
              height: "100%",
              borderRadius: "12px",
            })}
          />
        </section>
        <section
          className={css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            gap: "5",
          })}
        >
          <p
            className={css({
              color: "white",
              fontWeight: "bold",
              fontSize: "2xl",
            })}
          >
            Important Message
          </p>
          <p
            className={css({
              maxWidth: "400px",
              color: "white",
              opacity: 0.8,
            })}
          >
            Pixel Kit is dedicated to ensuring excellence and full compatibility
            with all browsers.
            <br /> On this occasion, we ask you to activate the{" "}
            <strong>"fingerprinting"</strong>
            feature to ensure optimal performance of Pixel Kit.
            <br /> <br /> Your collaboration in this regard will help us provide
            the best possible experience, so thank you for your commitment to
            quality!
          </p>
          <button
            onClick={() => setMounted(false)}
            className={css({
              backgroundColor: "#0496ff",
              borderRadius: "12px",
              fontSize: "sm",
              padding: "10px 20px",
              fontWeight: "bold",
              width: "max-content",
              cursor: "pointer",
              border: "1px solid #0496ff",
              color: "white",
              _hover: {
                border: "1px solid #0496ff",
                backgroundColor: "#003B66",
              },
            })}
          >
            Ok understood
          </button>
        </section>
      </div>
    </div>
  ) : null;
};

export default WarningBrowserBraveModal;

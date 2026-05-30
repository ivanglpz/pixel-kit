/* eslint-disable @next/next/no-img-element */
import type { ProjectDocument } from "@pixelkit/core";
import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import useBrowser from "./hooks/useBrowser";
import useStopZoom from "./hooks/useStopZoom";
import { useTimerAutoSave } from "./hooks/useTimerAutoSave";
import { AllLayers } from "./layers/root.layers";
import type { EditorAssetAdapter } from "./platform/assets";
import type { EditorPublicProjectAdapter } from "./platform/public-projects";
import type { EditorSaveAdapter } from "./platform/save";
import { LayerPublicShapes } from "./public/layers/shapes";
import { PixelKitStagePublic } from "./public/stage";
import { SidebarLeft } from "./sidebar/sidebar.left";
import SidebarRight from "./sidebar/sidebar.right";
import PxStage from "./stage";
import {
  BUILD_PROJECT_FROM_DOCUMENT,
  PROJECT_ID_ATOM,
} from "./states/projects";

type PixelEditorProps = {
  projectId?: string | null;
  initialProject?: ProjectDocument | null;
  saveAdapter?: EditorSaveAdapter;
  assetAdapter?: EditorAssetAdapter;
};

type PixelPublicEditorProps = {
  projectId?: string | null;
  shareUrl?: string;
  publicProjectAdapter?: EditorPublicProjectAdapter;
};

const PixelKitPublic = ({
  projectId,
  shareUrl,
  publicProjectAdapter,
}: PixelPublicEditorProps) => {
  useStopZoom();

  return (
    <div
      id="pixel-app"
      className={css({
        backgroundColor: "bg",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      })}
      style={{
        borderRadius: 12,
      }}
    >
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "1fr",
          backgroundColor: "black",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          height: "100%",
          borderRadius: 12,
        })}
      >
        <PixelKitStagePublic
          projectId={projectId}
          shareUrl={shareUrl}
          publicProjectAdapter={publicProjectAdapter}
        >
          <LayerPublicShapes />
        </PixelKitStagePublic>
      </div>
    </div>
  );
};

export const PixelKitPublicApp = (props: PixelPublicEditorProps) => (
  <PixelKitPublic {...props} />
);

const PixelEditor = ({
  projectId,
  initialProject,
  saveAdapter,
  assetAdapter,
}: PixelEditorProps) => {
  const setProjectId = useSetAtom(PROJECT_ID_ATOM);
  const buildProjectFromDocument = useSetAtom(BUILD_PROJECT_FROM_DOCUMENT);

  useEffect(() => {
    if (typeof projectId === "undefined") return;

    setProjectId(projectId);
  }, [projectId, setProjectId]);

  useEffect(() => {
    buildProjectFromDocument(initialProject);
  }, [initialProject, buildProjectFromDocument]);

  useStopZoom();
  useBrowser();
  useTimerAutoSave(saveAdapter);
  return (
    <div
      id="pixel-app"
      className={css({
        backgroundColor: "bg",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: "240px 1fr 240px",
          backgroundColor: "black",
          width: "100%",
          overflow: "hidden",
          position: "relative",
          height: "100%",
        })}
      >
        <SidebarLeft />
        <PxStage assetAdapter={assetAdapter}>
          <AllLayers />
        </PxStage>
        <SidebarRight assetAdapter={assetAdapter} />
      </div>
    </div>
  );
};
const ComponentApp = (props: PixelEditorProps) => <PixelEditor {...props} />;

export default ComponentApp;
export type { EditorAssetAdapter } from "./platform/assets";
export type { EditorPublicProjectAdapter } from "./platform/public-projects";
export type { EditorSaveAdapter } from "./platform/save";

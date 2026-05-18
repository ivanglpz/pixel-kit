import {
  serializeProjectSnapshot,
  type LocalProjectRecord,
  type ProjectDocument,
} from "@pixelkit/core";

export const localProjectToDocument = (
  project: LocalProjectRecord,
): ProjectDocument => {
  return {
    _id: project.id,
    name: project.name,
    isPublic: false,
    previewUrl: project.preview?.url ?? "./default_bg.png",
    data: serializeProjectSnapshot(project.snapshot),
    version: project.revision,
    mode: "DESIGN_MODE",
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
};

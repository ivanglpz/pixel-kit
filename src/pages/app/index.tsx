/* eslint-disable @next/next/no-img-element */
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/editor/components/button";
import { Dialog } from "@/editor/components/dialog";
import { Input } from "@/editor/components/input";
import { Loading } from "@/editor/components/loading";
import { constants } from "@/editor/constants/color";
import { PROJECT_ID_ATOM } from "@/editor/states/projects";
import { ADD_TAB_ATOM } from "@/editor/states/tabs";
import { fetchListOrgs } from "@/services/organizations";
import {
  createProject,
  deleteProject,
  fetchListProjects,
} from "@/services/projects";
import { getTimeAgoString } from "@/utils/edited";
import { css } from "@stylespixelkit/css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { BookOpenIcon, LayoutDashboard, Plus, Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NextPageWithLayout } from "../_app";

const App: NextPageWithLayout = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const router = useRouter();
  const setSelected = useSetAtom(PROJECT_ID_ATOM);
  const setTabs = useSetAtom(ADD_TAB_ATOM);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const mutateOrgs = useMutation({
    mutationKey: ["orgs_user"],
    mutationFn: async () => fetchListOrgs(),
    onSuccess: (data) => {
      setOrgId(data.at(0)?._id ?? null);
    },
  });

  const QueryProjects = useQuery({
    queryKey: ["projects_orgs", orgId],
    queryFn: async () => {
      if (!orgId) {
        throw new Error("Org Id is require");
      }
      return fetchListProjects(orgId);
    },
    enabled: Boolean(orgId),
    // staleTime: 1000 * 2,
    // cacheTime: 1000 * 60 * 60, // 1 hora
    // staleTime: 1000 * 30,
  });

  const mutateNewProject = useMutation({
    mutationKey: ["new_project", orgId],
    mutationFn: async (values: { name: string }) => {
      if (!orgId) {
        throw new Error("Org Id is require");
      }
      return createProject({
        name: values.name,
        organization: orgId,
      });
    },
    onSuccess: (data) => {
      QueryProjects.refetch();
      setTabs(data);
      setSelected(data._id);
      router.push(`/app/project/${data._id}`);
      toast.success("Project created successfully", {
        description: `The project "${data.name}" was added to your organization.`,
      });
      // formik.resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create project", {
        description:
          error?.message ||
          "There was an error creating your project. Please try again.",
      });
    },
  });
  const mutateDelete = useMutation({
    mutationFn: async (id: string) => {
      return deleteProject(id);
    },
    onSuccess: (data) => {
      QueryProjects.refetch();
      toast.success("Project deleted successfully");
      setDeleteDialog(null);
    },
    onError: (error) => {
      toast.error("Failed to delete project", {
        description:
          error?.message ||
          "There was an error deleting your project. Please try again.",
      });
    },
  });
  useEffect(() => {
    mutateOrgs.mutate();
  }, []);

  return (
    <section
      className={css({
        _dark: {
          backgroundColor: "gray.700",
        },
        backgroundColor: "gray.100",

        padding: "lg",
        gap: "xlg",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      })}
    >
      <Dialog.Provider
        visible={deleteDialog !== null}
        onClose={() => setDeleteDialog(null)}
      >
        <Dialog.Container>
          <Dialog.Header>
            <p
              className={css({
                fontWeight: "bold",
                paddingBottom: "lg",
              })}
            >
              Delete Project
            </p>
            <Dialog.Close onClose={() => setDeleteDialog(null)} />
          </Dialog.Header>
          <section className="h-full w-full flex-1">
            <p className="font-normal ">
              Are you sure you want to delete this project?
            </p>
            <p>
              This action <strong>cannot</strong> be undone.
            </p>
          </section>
          <footer className="flex flex-row gap-4 justify-end  ">
            <Button.Secondary onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button.Secondary>
            <Button.Danger onClick={() => mutateDelete.mutate(deleteDialog!)}>
              {mutateDelete.isPending ? (
                <Loading color={constants.theme.colors.white} />
              ) : (
                <>
                  <Trash size={constants.icon.size} /> Delete
                </>
              )}
            </Button.Danger>
          </footer>
        </Dialog.Container>
      </Dialog.Provider>
      <header
        className={css({
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        })}
      >
        <div
          className={css({
            display: "flex",
          })}
        >
          <Input.Container>
            <Input.Select
              options={
                mutateOrgs?.data?.map((e) => {
                  return {
                    id: e?._id,
                    label: e?.name,
                    value: e?._id,
                  };
                }) || []
              }
              value={orgId ?? ""}
              onChange={(e) => {
                setOrgId(e);
              }}
            ></Input.Select>
          </Input.Container>
        </div>
        <div>
          <Button.Primary
            onClick={() => {
              mutateNewProject.mutate({
                name: "Untitled",
              });
            }}
          >
            <Plus size={constants.icon.size} />
            Create Project
          </Button.Primary>
        </div>
      </header>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 overflow-auto w-full">
        {QueryProjects?.data?.map((project) => {
          return (
            <ContextMenu key={project?._id}>
              <ContextMenuTrigger className="flex flex-col w-[320px] h-[220px] border rounded-lg ">
                <img
                  src={project?.previewUrl}
                  alt={project?.name}
                  width="100"
                  height="20"
                  className="object-contain h-[150px] w-full bg-gray-100 dark:bg-neutral-700 rounded-t-lg"
                />
                <div className={"p-4 flex flex-row gap-2 items-center"}>
                  <div
                    className={css({
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    })}
                  >
                    <LayoutDashboard size={25} />
                  </div>
                  <div
                    className={css({
                      display: "flex",
                      flexDirection: "column",
                    })}
                  >
                    <button
                      onClick={() => {
                        setTabs(project);
                        setSelected(project._id);
                        router.push(`/app/project/${project._id}`);
                      }}
                      className="p-0 flex flex-row items-start hover:underline cursor-pointer"
                    >
                      <p
                        className={css({
                          fontSize: "sm",
                          fontWeight: "bold",
                        })}
                      >
                        {project?.name}
                      </p>
                    </button>
                    <p
                      className={css({
                        fontSize: "11px",
                      })}
                    >
                      {getTimeAgoString(project.updatedAt)}
                    </p>
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-52">
                <ContextMenuItem
                  onClick={() => {
                    setTabs(project);
                    setSelected(project._id);
                    router.push(`/app/project/${project._id}`);
                  }}
                >
                  <BookOpenIcon
                    size={constants.icon.size}
                    color={constants.theme.colors.white}
                  />
                  <p>Open</p>
                </ContextMenuItem>
                <ContextMenuItem inset disabled>
                  Duplicate
                </ContextMenuItem>

                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => setDeleteDialog(project._id)}>
                  <Trash
                    size={constants.icon.size}
                    className="mr-2"
                    color={constants.theme.colors["red.400"]}
                  />
                  <p className="text-red-500 hover:text-red-500">Delete</p>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>
    </section>
  );
};
App.layout = "App";
export default App;

/* eslint-disable @next/next/no-img-element */
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/editor/components/button";
import { Input } from "@/editor/components/input";
import { constants } from "@/editor/constants/color";
import { PROJECT_ID_ATOM } from "@/editor/states/projects";
import { ADD_TAB_ATOM } from "@/editor/states/tabs";
import { fetchListOrgs } from "@/services/organizations";
import { createProject, fetchListProjects } from "@/services/projects";
import { getTimeAgoString } from "@/utils/edited";
import { css } from "@stylespixelkit/css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { LayoutDashboard, Plus } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NextPageWithLayout } from "../_app";

const App: NextPageWithLayout = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const router = useRouter();
  const setSelected = useSetAtom(PROJECT_ID_ATOM);
  const setTabs = useSetAtom(ADD_TAB_ATOM);

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
      <div
        className={
          "flex flex-row flex-wrap gap-lg overflow-auto h-full w-full gap-4"
        }
      >
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
                <ContextMenuItem inset>
                  Back
                  <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset disabled>
                  Forward
                  <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset>
                  Reload
                  <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger inset>
                    More Tools
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-44">
                    <ContextMenuItem>Save Page...</ContextMenuItem>
                    <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                    <ContextMenuItem>Name Window...</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Developer Tools</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem variant="destructive">
                      Delete
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuCheckboxItem checked>
                  Show Bookmarks
                </ContextMenuCheckboxItem>
                <ContextMenuCheckboxItem>
                  Show Full URLs
                </ContextMenuCheckboxItem>
                <ContextMenuSeparator />
                <ContextMenuRadioGroup value="pedro">
                  <ContextMenuLabel inset>People</ContextMenuLabel>
                  <ContextMenuRadioItem value="pedro">
                    Pedro Duarte
                  </ContextMenuRadioItem>
                  <ContextMenuRadioItem value="colm">
                    Colm Tuite
                  </ContextMenuRadioItem>
                </ContextMenuRadioGroup>
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

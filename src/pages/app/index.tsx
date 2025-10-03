/* eslint-disable @next/next/no-img-element */
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
      setTabs(data);
      setSelected(data._id);
      router.push(`/app/project/${data._id}`);
      toast.success("Project created successfully", {
        description: `The project "${data.name}" was added to your organization.`,
      });
      QueryProjects.refetch();
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
        className={css({
          height: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gridAutoRows: "244px",
          gap: "xlg",
          overflowY: "scroll",
        })}
      >
        {QueryProjects?.data?.map((project) => {
          return (
            <div
              key={project?._id}
              onClick={() => {
                setTabs(project);
                setSelected(project._id);
                router.push(`/app/project/${project._id}`);
              }}
              className={css({
                display: "grid",
                gridTemplateRows: "160px 1fr",
                borderRadius: "lg",
                backgroundColor: "gray.50",
                // _dark: {
                //   backgroundColor: "gray.600",
                // },
                borderWidth: 1,
                borderColor: "gray.150",
                _dark: {
                  borderColor: "gray.450",
                  backgroundColor: "gray.700",
                },
              })}
            >
              <img
                src={project?.previewUrl}
                alt={project?.name}
                className={css({
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                  borderTopRadius: "lg",
                })}
              />
              <div
                className={css({
                  padding: "lg",
                  display: "grid",
                  gridTemplateColumns: "30px 1fr",
                  alignContent: "center",
                  gap: "md",
                })}
              >
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
                  <p
                    className={css({
                      fontSize: "sm",
                      fontWeight: "bold",
                    })}
                  >
                    {project?.name}
                  </p>
                  <p
                    className={css({
                      fontSize: "11px",
                    })}
                  >
                    {getTimeAgoString(project.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
App.layout = "App";
export default App;

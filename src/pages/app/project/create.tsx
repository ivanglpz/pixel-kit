import { Input } from "@/editor/components/input";
import { PROJECT_ID_ATOM } from "@/editor/states/projects";
import { ADD_TAB_ATOM } from "@/editor/states/tabs";
import { NextPageWithLayout } from "@/pages/_app";
import { fetchListOrgs } from "@/services/organizations";
import { createProject } from "@/services/projects";
import { css } from "@stylespixelkit/css";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { FileQuestion, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ProjectCreate: NextPageWithLayout = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const router = useRouter();
  const setSelected = useSetAtom(PROJECT_ID_ATOM);
  const setTabs = useSetAtom(ADD_TAB_ATOM);
  const mutateOrgs = useMutation({
    mutationKey: ["create_orgs"],
    mutationFn: async () => fetchListOrgs(),
    onSuccess: (data) => {
      setOrgId(data.at(0)?._id ?? null);
    },
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
      router.push(`/app/project/${data?._id}`);
      // setShowCreate(false);
      // QueryProjects.refetch();
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        justifyContent: "center",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "lg",
        })}
      >
        <header
          className={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "lg",
          })}
        >
          <p>Create file in:</p>
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
        </header>
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            gap: "lg",
          })}
        >
          {Array.from({
            length: 5,
          }).map((e, index) => {
            if (index > 0) {
              return (
                <div
                  key={`static-${index}`}
                  className={css({
                    padding: "lg",
                    display: "flex",
                    flexDirection: "column",
                    width: 100,
                    height: 100,
                    justifyContent: "flex-end",
                    borderColor: "gray.150",
                    borderWidth: 1,
                    color: "black",
                    _dark: { color: "white", borderColor: "gray.700" },
                    borderRadius: "lg",
                    opacity: 0.6,
                  })}
                >
                  <FileQuestion size={20} />

                  <div
                    className={css({
                      display: "flex",
                      flexDirection: "row",
                    })}
                  >
                    <p
                      className={css({
                        fontWeight: "bold",
                        width: "auto",
                      })}
                    >
                      ?????
                    </p>
                  </div>
                </div>
              );
            }
            return (
              <button
                key={`options-create-${index}`}
                className={css({
                  padding: "lg",
                  display: "flex",
                  flexDirection: "column",
                  width: 100,
                  height: 100,
                  justifyContent: "flex-end",
                  borderColor: "gray.150",
                  borderWidth: 1,
                  color: "black",
                  _dark: { color: "white", borderColor: "gray.700" },
                  borderRadius: "lg",
                  cursor: "pointer",
                  _hover: {
                    backgroundColor: "primary",
                  },
                })}
                onClick={() => {
                  mutateNewProject.mutate({
                    name: "Untitled",
                  });
                }}
              >
                <LayoutDashboard size={20} />

                <div
                  className={css({
                    display: "flex",
                    flexDirection: "row",
                  })}
                >
                  <p
                    className={css({
                      fontWeight: "bold",
                      width: "auto",
                    })}
                  >
                    Design
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {/* <Input.Label text="Name" />
        <Input.Text
          value={formik.values.name}
          onChange={(e) => formik.setFieldValue("name", e)}
        />
        <Button.Primary onClick={() => formik.submitForm()}>
          <Plus size={constants.icon.size} />
          Create
        </Button.Primary> */}
      </div>
    </section>
  );
};

ProjectCreate.layout = "Editor";

export default ProjectCreate;

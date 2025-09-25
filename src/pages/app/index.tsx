/* eslint-disable @next/next/no-img-element */
import { IProject } from "@/db/schemas/types";
import { Button } from "@/editor/components/button";
import { Dialog } from "@/editor/components/dialog";
import { Input } from "@/editor/components/input";
import { constants } from "@/editor/constants/color";
import { ICON_MODES_TABS } from "@/editor/icons/mode";
import { fetchListOrgs } from "@/services/organizations";
import { createProject, fetchListProjects } from "@/services/projects";
import { css } from "@stylespixelkit/css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CardProject = ({ project }: { project: IProject }) => {
  // const text = useAtomValue(project.name);
  // const mode = useAtomValue(project.MODE_ATOM);
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateRows: "230px 1fr",
        borderRadius: "lg",
        borderWidth: 1,
        borderColor: "bg.elevated",
      })}
    >
      <img
        src={project?.previewUrl}
        alt={project?.name}
        className={css({
          height: "100%",
          width: "100%",
          objectFit: "cover",
          borderRadius: "lg",
        })}
      />
      <div
        className={css({
          padding: "lg",
          display: "grid",
          gridTemplateColumns: "30px 1fr",
          alignItems: "center",
        })}
      >
        {/* ke */}
        {ICON_MODES_TABS.DESIGN_MODE}
        <div>
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            {project?.name}
          </p>
          <p
            className={css({
              fontSize: "sm",
              opacity: 0.5,
            })}
          >
            {new Date(project?.updatedAt).toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

import * as Yup from "yup";
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
});
const App = () => {
  const [orgId, setOrgId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
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
      toast.success("Project created successfully", {
        description: `The project "${data.name}" was added to your organization.`,
      });
      setShowCreate(false);
      QueryProjects.refetch();
      formik.resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create project", {
        description:
          error?.message ||
          "There was an error creating your project. Please try again.",
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (values) => mutateNewProject.mutate(values),
  });

  useEffect(() => {
    mutateOrgs.mutate();
  }, []);

  return (
    <div
      className={css({
        backgroundColor: "bg",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div
        className={css({
          backgroundColor: "black",
          overflowY: "hidden",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "300px 1fr",
        })}
      >
        <aside
          className={css({
            padding: "lg",
            backgroundColor: "bg",
            borderRightWidth: "1px",
            borderRightStyle: "solid",
            borderRightColor: "border", // ← usa el semantic token
            overflow: "hidden",
          })}
        >
          test
        </aside>
        <section
          className={css({
            backgroundColor: "gray.700",

            padding: "lg",
            gap: "xlg",
            display: "flex",
            flexDirection: "column",
          })}
        >
          <Dialog.Provider
            visible={showCreate}
            onClose={() => {
              setShowCreate(false);
            }}
          >
            <Dialog.Container>
              <Dialog.Header>
                <p className={css({ fontWeight: "bold" })}>New Project</p>
                <Dialog.Close onClose={() => setShowCreate(false)} />
              </Dialog.Header>
              <div
                className={css({
                  display: "flex",
                  flexDir: "column",
                  gap: "lg",
                })}
              >
                <Input.Label text="Name" />
                <Input.Text
                  value={formik.values.name}
                  onChange={(e) => formik.setFieldValue("name", e)}
                />
                {formik.errors.name ? (
                  <p
                    className={css({
                      color: "red.dark.600",
                      fontWeight: "bold",
                      fontSize: "x-small",
                    })}
                  >
                    {formik.errors.name}
                  </p>
                ) : null}
                <Button.Primary onClick={() => formik.submitForm()}>
                  Create
                </Button.Primary>
              </div>
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
                  setShowCreate(true);
                }}
              >
                <Plus size={constants.icon.size} />
                Create Project
              </Button.Primary>
            </div>
          </header>
          <div
            className={css({
              overflowY: "scroll",
              height: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gridAutoRows: "300px",
              gap: "xlg",
            })}
          >
            {QueryProjects?.data?.map((e) => {
              return <CardProject key={e?._id} project={e} />;
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
export default App;

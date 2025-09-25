/* eslint-disable @next/next/no-img-element */
import { IProject } from "@/db/schemas/types";
import { Input } from "@/editor/components/input";
import { ICON_MODES_TABS } from "@/editor/icons/mode";
import { PROJECTS_ATOM } from "@/editor/states/projects";
import { fetchListOrgs } from "@/services/organizations";
import { fetchListProjects } from "@/services/projects";
import { css } from "@stylespixelkit/css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

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
        src="./placeholder.svg"
        alt=""
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
const App = () => {
  const listProjects = useAtomValue(PROJECTS_ATOM);

  const [orgId, setOrgId] = useState<string | null>(null);

  const mutateOrgs = useMutation({
    mutationKey: ["orgs_user"],
    mutationFn: async () => fetchListOrgs(),
    onSuccess: (data) => {
      setOrgId(data.at(0)?._id ?? null);
      console.log(data);
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
            // overflowY: "scroll",
            // height: "100%",
            // display: "grid",
            // gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            // gridAutoRows: "300px",
            padding: "lg",
            // gap: "xlg",
            display: "flex",
            flexDirection: "column",
          })}
        >
          <header>
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

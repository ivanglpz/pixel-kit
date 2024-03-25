import { useReference } from "@/editor/hooks/reference";
import { css } from "@stylespixelkit/css";
type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function downloadBase64Image(base64String: string, filename: string) {
  var link = document.createElement("a");
  link.download = filename;
  link.href = base64String;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const ExportStage = ({ height, width, x, y }: Props) => {
  const { ref } = useReference({ type: "STAGE" });

  const handleExport = () => {
    // const image = ref?.current?.toDataURL({
    //   quality: 1,
    // });
    // downloadBase64Image(image, "test.png");
    // console.log(image?.length);
  };
  return (
    <div
      className={css({
        padding: "lg",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        backgroundColor: "primary",
        borderRadius: "lg",
        border: "container",
      })}
    >
      <p
        className={css({
          fontSize: "md",
          color: "text",
          fontWeight: "bold",
        })}
      >
        Export
      </p>
      <button
        type="button"
        className={css({
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "secondary",
          borderRadius: "md",
          padding: "md",
          color: "text",
          textAlign: "center",
        })}
        onClick={handleExport}
      >
        Export
      </button>
    </div>
  );
};

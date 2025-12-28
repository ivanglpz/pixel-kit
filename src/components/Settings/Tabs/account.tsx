/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/editor/components/loading";
import { constants } from "@/editor/constants/color";
import { userAtom } from "@/jotai/user";
import { NextPageWithLayout } from "@/pages/_app";
import { updateUserProfile, uploadUserPhoto } from "@/services/users";
import { base64ToFile } from "@/utils/base64toFile";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { toast } from "sonner";
export const AccountSettings: NextPageWithLayout = () => {
  const user = useAtomValue(userAtom);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        formik.setFieldValue("photoUrl", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const mutate = useMutation({
    mutationFn: async (values: {
      photoUrl: string | null;
      fullName: string;
    }) => {
      if (!values.photoUrl) {
        await updateUserProfile({
          fullName: values.fullName,
          photoUrl: user?.data?.user?.photoUrl || "./default_bg.png",
        });
        return;
      }

      const formData = new FormData();
      formData.append("image", base64ToFile(values.photoUrl, "preview.png")); // usar el mismo nombre 'images'
      const newPhotoUrl = await uploadUserPhoto(formData);

      await updateUserProfile({
        fullName: values.fullName,
        photoUrl: newPhotoUrl.url,
      });
    },
    onSuccess: () => {
      user.refetch();
      toast.success("Profile updated successfully");
    },
    onError: (err: { response: { data: { error: string } } }) => {
      toast.error(err.response?.data?.error || "Error updating profile");
    },
  });
  const formik = useFormik({
    initialValues: {
      photoUrl: "" as string | null,
      fullName: user?.data?.user?.fullName || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      mutate.mutate(values);
    },
  });

  return (
    <section className="p-4 h-full  overflow-hidden">
      <div className=" max-w-md flex flex-col gap-4">
        <div className="grid gap-2 wd">
          <Label>Avatar</Label>
          <section className="flex flex-row gap-4">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFiles}
            />
            <img
              src={
                formik.values.photoUrl ||
                user?.data?.user?.photoUrl ||
                "/default_bg.png"
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div className="flex flex-col justify-center gap-2 ">
              <Button
                variant={"outline"}
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer"
              >
                Change Avatar
              </Button>
            </div>
          </section>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Email</Label>
          <Input
            id="username"
            type="text"
            placeholder="Your username"
            value={user?.data?.user?.email || ""}
            onChange={formik.handleChange}
            name="fullName"
            disabled
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Your username"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            name="fullName"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
      </div>
      <footer>
        <Button
          className="mt-4"
          onClick={() => {
            formik.submitForm();
          }}
        >
          {mutate.isPending ? (
            <Loading color={constants.theme.colors.black} />
          ) : (
            "Save"
          )}
        </Button>
      </footer>
    </section>
  );
};

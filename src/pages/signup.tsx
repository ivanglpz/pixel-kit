import { createUser } from "@/services/users";
import { css } from "@stylespixelkit/css";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { toast } from "sonner";
import * as Yup from "yup";
const validationSchema = Yup.object({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("This email is not valid")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: (e) => {
      Cookies.set("accessToken", e?.data?.token); // Expira en 7 días
      toast.success("Registration Successful!", {
        description: "Your account has been created successfully.",
      });
      router.push("/");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error("Uh oh! Something went wrong.", {
          description: error?.response?.data?.error,
        });
      }
    },
  });
  const formik = useFormik({
    initialValues: {
      fullName: "",
      password: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  return (
    <main
      className={css({
        display: "grid",
        gridColumn: "2",
      })}
    >
      <section>t</section>
      <section>
        <p>Sign up</p>
        <input
          type="text"
          name="fullName"
          id="fullName"
          value={formik.values.fullName}
          onChange={formik.handleChange}
        />
        <input
          type="email"
          name="email"
          id="email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <button onClick={() => formik.submitForm()}>click</button>
      </section>
    </main>
  );
};
export default LoginPage;

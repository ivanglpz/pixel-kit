import { Loading } from "@/editor/components/loading";
import { createUser } from "@/services/users";
import { css } from "@stylespixelkit/css";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import Link from "next/link";
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "lg",
        backgroundColor: "gray.150",

        _dark: {
          backgroundColor: "gray.800",
        },
      })}
    >
      <section
        className={css({
          display: "flex",
          flexDirection: "row",
          gap: "sm",
          alignItems: "center",
        })}
      >
        <div
          className={css({
            backgroundColor: "gray.800",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 25,
            height: 25,
          })}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_2552_519)">
              <path
                d="M42.7068 0.210449H49.7896V21.4586H42.7068V7.29322H7.29322V42.7068H21.4586V49.7896H0.210449V0.210449H42.7068ZM28.5414 35.6242V28.5414H49.7896V35.6242H42.7068V42.7068H35.6242V49.7896H28.5414V35.6242ZM42.7068 42.7068V49.7896H49.7896V42.7068H42.7068Z"
                fill="black"
              />
              <mask
                id="mask0_2552_519"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="50"
                height="50"
              >
                <path
                  d="M42.7068 0.210449H49.7896V21.4586H42.7068V7.29322H7.29322V42.7068H21.4586V49.7896H0.210449V0.210449H42.7068ZM28.5414 35.6242V28.5414H49.7896V35.6242H42.7068V42.7068H35.6242V49.7896H28.5414V35.6242ZM42.7068 42.7068V49.7896H49.7896V42.7068H42.7068Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_2552_519)">
                <path
                  d="M49.7896 0.210452H98.064V-48.064H49.7896V0.210452ZM49.7896 21.4586V69.733H98.064V21.4586H49.7896ZM42.7068 21.4586H-5.56757V69.733H42.7068V21.4586ZM42.7068 7.29322H90.9812V-40.9812H42.7068V7.29322ZM7.29322 7.29322V-40.9812H-40.9812V7.29322H7.29322ZM7.29322 42.7068H-40.9812V90.9812H7.29322V42.7068ZM21.4586 42.7068H69.733V-5.56757H21.4586V42.7068ZM21.4586 49.7896V98.064H69.733V49.7896H21.4586ZM0.210452 49.7896H-48.064V98.064H0.210452V49.7896ZM0.210452 0.210452V-48.064H-48.064V0.210452H0.210452ZM28.5414 28.5414V-19.733H-19.733V28.5414H28.5414ZM49.7896 28.5414H98.064V-19.733H49.7896V28.5414ZM49.7896 35.6242V83.8986H98.064V35.6242H49.7896ZM42.7068 35.6242V-12.6503H-5.56757V35.6242H42.7068ZM35.6242 42.7068V-5.56757H-12.6503V42.7068H35.6242ZM35.6242 49.7896V98.064H83.8986V49.7896H35.6242ZM28.5414 49.7896H-19.733V98.064H28.5414V49.7896ZM42.7068 49.7896H-5.56757V98.064H42.7068V49.7896ZM49.7896 49.7896V98.064H98.064V49.7896H49.7896ZM49.7896 42.7068H98.064V-5.56757H49.7896V42.7068ZM42.7068 48.4849H49.7896V-48.064H42.7068V48.4849ZM1.51517 0.210452V21.4586H98.064V0.210452H1.51517ZM49.7896 -26.8158H42.7068V69.733H49.7896V-26.8158ZM90.9812 21.4586V7.29322H-5.56757V21.4586H90.9812ZM42.7068 -40.9812H7.29322V55.5676H42.7068V-40.9812ZM-40.9812 7.29322V42.7068H55.5676V7.29322H-40.9812ZM7.29322 90.9812H21.4586V-5.56757H7.29322V90.9812ZM-26.8158 42.7068V49.7896H69.733V42.7068H-26.8158ZM21.4586 1.51517H0.210452V98.064H21.4586V1.51517ZM48.4849 49.7896V0.210452H-48.064V49.7896H48.4849ZM0.210452 48.4849H42.7068V-48.064H0.210452V48.4849ZM76.8158 35.6242V28.5414H-19.733V35.6242H76.8158ZM28.5414 76.8158H49.7896V-19.733H28.5414V76.8158ZM1.51517 28.5414V35.6242H98.064V28.5414H1.51517ZM49.7896 -12.6503H42.7068V83.8986H49.7896V-12.6503ZM-5.56757 35.6242V42.7068H90.9812V35.6242H-5.56757ZM42.7068 -5.56757H35.6242V90.9812H42.7068V-5.56757ZM-12.6503 42.7068V49.7896H83.8986V42.7068H-12.6503ZM35.6242 1.51517H28.5414V98.064H35.6242V1.51517ZM76.8158 49.7896V35.6242H-19.733V49.7896H76.8158ZM-5.56757 42.7068V49.7896H90.9812V42.7068H-5.56757ZM42.7068 98.064H49.7896V1.51517H42.7068V98.064ZM98.064 49.7896V42.7068H1.51517V49.7896H98.064ZM49.7896 -5.56757H42.7068V90.9812H49.7896V-5.56757Z"
                  fill="white"
                />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_2552_519">
                <rect width="50" height="50" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <p
          className={css({
            fontWeight: "bold",
            fontSize: "sm",
          })}
        >
          Pixel kit
        </p>
      </section>
      <section
        className={css({
          display: "flex",
          flexDirection: "column",
          // backgroundColor: "red",
          padding: "xxlg",
          borderWidth: 1,
          borderColor: "gray.150",
          backgroundColor: "gray.50",
          _dark: {
            borderColor: "gray.450",
            backgroundColor: "gray.700",
          },
          borderRadius: "lg",
          gap: "xxlg",
        })}
      >
        <header
          className={css({
            display: "flex",
            flexDirection: "column",
            gap: "sm",
            alignItems: "center",
          })}
        >
          <p
            className={css({
              fontWeight: "bold",
              fontSize: "md",
            })}
          >
            Create your account
          </p>
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            Create and customize beautiful interfaces easily.
          </p>
        </header>
        <div
          className={css({
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "xxlg",
          })}
        >
          <section
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "md",
            })}
          >
            <label
              htmlFor="fullName"
              className={css({
                fontSize: "sm",
                fontWeight: 700,
              })}
            >
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="whil"
              className={css({
                backgroundColor: "transparent",
                color: "text",
                padding: "md",
                borderRadius: "md",
                fontSize: "sm",
                width: "100%",
                borderWidth: 1,
                borderColor:
                  formik.touched.fullName && formik.errors.fullName
                    ? "red"
                    : "gray.150",
                _dark: {
                  borderColor:
                    formik.touched.fullName && formik.errors.fullName
                      ? "red"
                      : "gray.450",
                },
              })}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <span
                className={css({
                  color: "red",
                  fontSize: "x-small",
                  marginTop: "xs",
                  fontWeight: "bold",
                })}
              >
                {formik.errors.fullName}
              </span>
            )}
          </section>

          <section
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "md",
            })}
          >
            <label
              htmlFor="email"
              className={css({
                fontSize: "sm",
                fontWeight: 700,
              })}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="whil@example.com"
              className={css({
                backgroundColor: "transparent",
                color: "text",
                padding: "md",
                borderRadius: "md",
                fontSize: "sm",
                width: "100%",
                borderWidth: 1,
                borderColor:
                  formik.touched.email && formik.errors.email
                    ? "red"
                    : "gray.150",
                _dark: {
                  borderColor:
                    formik.touched.email && formik.errors.email
                      ? "red"
                      : "gray.450",
                },
              })}
            />
            {formik.touched.email && formik.errors.email && (
              <span
                className={css({
                  color: "red",
                  fontSize: "x-small",
                  marginTop: "xs",
                  fontWeight: "bold",
                })}
              >
                {formik.errors.email}
              </span>
            )}
          </section>

          <section
            className={css({
              display: "flex",
              flexDirection: "column",
              gap: "md",
            })}
          >
            <label
              htmlFor="password"
              className={css({
                fontSize: "sm",
                fontWeight: 700,
              })}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={css({
                border: "container",
                backgroundColor: "transparent",
                color: "text",
                padding: "md",
                borderRadius: "md",
                width: "100%",
                fontSize: "sm",
                borderWidth: 1,
                borderColor:
                  formik.touched.password && formik.errors.password
                    ? "red"
                    : "gray.150",
                _dark: {
                  borderColor:
                    formik.touched.password && formik.errors.password
                      ? "red"
                      : "gray.450",
                },
              })}
            />
            {formik.touched.password && formik.errors.password && (
              <span
                className={css({
                  color: "red",
                  fontSize: "x-small",
                  marginTop: "xs",
                  fontWeight: "bold",
                })}
              >
                {formik.errors.password}
              </span>
            )}
          </section>

          <button
            className={
              "login-button " +
              css({
                backgroundColor: "gray.800",
                color: "gray.50",
                padding: "md",
                borderRadius: "md",
                fontSize: "sm",
                fontWeight: "bold",
                width: "100%",
                cursor: "pointer",
                marginTop: "lg",
                borderWidth: 1,
                borderColor: "gray.150",

                _dark: {
                  backgroundColor: "gray.50",
                  color: "gray.800",
                  borderColor: "gray.750",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })
            }
            onClick={() => formik.submitForm()}
          >
            {mutation.isPending ? <Loading color="black" /> : "Sign up"}
          </button>
        </div>
        <footer
          className={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "sm",
            justifyContent: "center",
          })}
        >
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            You have an account?
          </p>
          <Link
            href={"/login"}
            className={css({
              fontSize: "sm",
              textDecoration: "underline",
            })}
          >
            Login
          </Link>
        </footer>
      </section>
    </main>
  );
};
export default LoginPage;

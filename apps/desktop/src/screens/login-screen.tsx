import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getDesktopApi } from "../lib/desktop-api";
import { desktopQueryKeys } from "../lib/query-keys";
import { useDesktopSession } from "../lib/queries";
import { desktopPaths } from "../routes/paths";

export const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const sessionQuery = useDesktopSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => getDesktopApi().auth.login({ email, password }),
    onSuccess: (session) => {
      queryClient.setQueryData(desktopQueryKeys.session, session);
      setMessage("Session cached for offline use.");

      const nextPath =
        typeof location.state === "object" &&
        location.state !== null &&
        "from" in location.state &&
        typeof location.state.from === "string"
          ? location.state.from
          : desktopPaths.projects;

      navigate(nextPath, { replace: true });
    },
    onError: (error) => {
      setMessage(error instanceof Error ? error.message : "Login failed");
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-white">
      <section className="flex w-full max-w-sm flex-col gap-4">
        <header>
          <p className="text-sm text-neutral-400">PixelKit Desktop</p>
          <h1 className="text-2xl font-semibold">Sign in</h1>
        </header>
        <input
          className="h-10 rounded border border-neutral-700 bg-neutral-900 px-3"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          className="h-10 rounded border border-neutral-700 bg-neutral-900 px-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          className="h-10 rounded bg-white font-medium text-neutral-950 disabled:opacity-60"
          onClick={() => loginMutation.mutate()}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </button>
        {message ? <p className="text-sm text-neutral-400">{message}</p> : null}
        {sessionQuery.error && !message ? (
          <p className="text-sm text-neutral-400">
            {sessionQuery.error instanceof Error
              ? sessionQuery.error.message
              : "Desktop bridge is not available"}
          </p>
        ) : null}
      </section>
    </main>
  );
};

import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { FullscreenState } from "../components/fullscreen-state";
import { useDesktopSession } from "../lib/queries";
import { desktopPaths } from "./paths";
import { LoginScreen } from "../screens/login-screen";
import { ProjectEditorScreen } from "../screens/project-editor-screen";
import { ProjectsScreen } from "../screens/projects-screen";

const HomeRedirect = () => {
  const sessionQuery = useDesktopSession();

  if (sessionQuery.isPending) {
    return <FullscreenState message="Loading session..." />;
  }

  if (sessionQuery.data) {
    return <Navigate to={desktopPaths.projects} replace />;
  }

  return <Navigate to={desktopPaths.login} replace />;
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const sessionQuery = useDesktopSession();
  const location = useLocation();

  if (sessionQuery.isPending) {
    return <FullscreenState message="Loading session..." />;
  }

  if (sessionQuery.data) {
    return children;
  }

  return (
    <Navigate
      to={desktopPaths.login}
      replace
      state={{ from: location.pathname }}
    />
  );
};

const PublicOnlyRoute = ({ children }: { children: JSX.Element }) => {
  const sessionQuery = useDesktopSession();

  if (sessionQuery.isPending) {
    return <FullscreenState message="Loading session..." />;
  }

  if (sessionQuery.data) {
    return <Navigate to={desktopPaths.projects} replace />;
  }

  return children;
};

const RouterContent = () => {
  return (
    <Routes>
      <Route path={desktopPaths.root} element={<HomeRedirect />} />
      <Route
        path={desktopPaths.login}
        element={
          <PublicOnlyRoute>
            <LoginScreen />
          </PublicOnlyRoute>
        }
      />
      <Route
        path={desktopPaths.projects}
        element={
          <ProtectedRoute>
            <ProjectsScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path={desktopPaths.project}
        element={
          <ProtectedRoute>
            <ProjectEditorScreen />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={desktopPaths.root} replace />} />
    </Routes>
  );
};

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <RouterContent />
    </BrowserRouter>
  );
};

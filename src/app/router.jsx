import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/store/useAuthStore";
import { AppShell } from "../shared/ui/AppShell";
import { StateNotice } from "../shared/ui/StateNotice";

const AdminDashboardPage = lazy(() =>
  import("../features/admin/pages/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage }))
);
const AdminPlacesPage = lazy(() =>
  import("../features/admin/pages/AdminPlacesPage").then((module) => ({ default: module.AdminPlacesPage }))
);
const AdminReviewsPage = lazy(() =>
  import("../features/admin/pages/AdminReviewsPage").then((module) => ({ default: module.AdminReviewsPage }))
);
const AdminUsersPage = lazy(() =>
  import("../features/admin/pages/AdminUsersPage").then((module) => ({ default: module.AdminUsersPage }))
);
const AdminPasswordResetsPage = lazy(() =>
  import("../features/admin/pages/AdminPasswordResetsPage").then((module) => ({ default: module.AdminPasswordResetsPage }))
);
const HomePage = lazy(() => import("../features/home/pages/HomePage").then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const ForgotPasswordPage = lazy(() =>
  import("../features/auth/pages/ForgotPasswordPage").then((module) => ({ default: module.ForgotPasswordPage }))
);
const RegisterPage = lazy(() =>
  import("../features/auth/pages/RegisterPage").then((module) => ({ default: module.RegisterPage }))
);
const ChangePasswordPage = lazy(() =>
  import("../features/auth/pages/ChangePasswordPage").then((module) => ({ default: module.ChangePasswordPage }))
);
const AccountPage = lazy(() =>
  import("../features/profile/pages/AccountPage").then((module) => ({ default: module.AccountPage }))
);
const MyPlacesPage = lazy(() =>
  import("../features/profile/pages/MyPlacesPage").then((module) => ({ default: module.MyPlacesPage }))
);
const MyReviewsPage = lazy(() =>
  import("../features/profile/pages/MyReviewsPage").then((module) => ({ default: module.MyReviewsPage }))
);
const PlaceDetailPage = lazy(() =>
  import("../features/places/pages/PlaceDetailPage").then((module) => ({ default: module.PlaceDetailPage }))
);
const PlacesPage = lazy(() =>
  import("../features/places/pages/PlacesPage").then((module) => ({ default: module.PlacesPage }))
);
const SubmitPlacePage = lazy(() =>
  import("../features/places/pages/SubmitPlacePage").then((module) => ({ default: module.SubmitPlacePage }))
);

function ProtectedRoute({ allowedRoles }) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);
  const mustChangePassword = useAuthStore((state) => state.user?.mustChangePassword);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (mustChangePassword && location.pathname !== "/change-password") {
    return <Navigate to="/change-password" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function RouteLoadingFallback() {
  return <StateNotice tone="loading">กำลังเปิดหน้า...</StateNotice>;
}

function LazyPage({ children }) {
  return <Suspense fallback={<RouteLoadingFallback />}>{children}</Suspense>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            index
            element={
              <LazyPage>
                <HomePage />
              </LazyPage>
            }
          />
          <Route
            path="places"
            element={
              <LazyPage>
                <PlacesPage />
              </LazyPage>
            }
          />
          <Route
            path="places/:slug"
            element={
              <LazyPage>
                <PlaceDetailPage />
              </LazyPage>
            }
          />
          <Route
            path="login"
            element={
              <LazyPage>
                <LoginPage />
              </LazyPage>
            }
          />
          <Route
            path="register"
            element={
              <LazyPage>
                <RegisterPage />
              </LazyPage>
            }
          />
          <Route
            path="forgot-password"
            element={
              <LazyPage>
                <ForgotPasswordPage />
              </LazyPage>
            }
          />

          <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
            <Route
              path="change-password"
              element={
                <LazyPage>
                  <ChangePasswordPage />
                </LazyPage>
              }
            />
            <Route
              path="account"
              element={
                <LazyPage>
                  <AccountPage />
                </LazyPage>
              }
            />
            <Route
              path="submit-place"
              element={
                <LazyPage>
                  <SubmitPlacePage />
                </LazyPage>
              }
            />
            <Route
              path="my-places/:placeId/edit"
              element={
                <LazyPage>
                  <SubmitPlacePage />
                </LazyPage>
              }
            />
            <Route
              path="my-places"
              element={
                <LazyPage>
                  <MyPlacesPage />
                </LazyPage>
              }
            />
            <Route
              path="my-reviews"
              element={
                <LazyPage>
                  <MyReviewsPage />
                </LazyPage>
              }
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route
              path="admin"
              element={
                <LazyPage>
                  <AdminDashboardPage />
                </LazyPage>
              }
            />
            <Route
              path="admin/places"
              element={
                <LazyPage>
                  <AdminPlacesPage />
                </LazyPage>
              }
            />
            <Route
              path="admin/reviews"
              element={
                <LazyPage>
                  <AdminReviewsPage />
                </LazyPage>
              }
            />
            <Route
              path="admin/users"
              element={
                <LazyPage>
                  <AdminUsersPage />
                </LazyPage>
              }
            />
            <Route
              path="admin/password-resets"
              element={
                <LazyPage>
                  <AdminPasswordResetsPage />
                </LazyPage>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

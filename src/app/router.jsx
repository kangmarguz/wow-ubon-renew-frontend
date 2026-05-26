import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AdminDashboardPage } from "../features/admin/pages/AdminDashboardPage";
import { AdminPlacesPage } from "../features/admin/pages/AdminPlacesPage";
import { AdminReviewsPage } from "../features/admin/pages/AdminReviewsPage";
import { AdminUsersPage } from "../features/admin/pages/AdminUsersPage";
import { HomePage } from "../features/home/pages/HomePage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { AccountPage } from "../features/profile/pages/AccountPage";
import { MyPlacesPage } from "../features/profile/pages/MyPlacesPage";
import { MyReviewsPage } from "../features/profile/pages/MyReviewsPage";
import { PlaceDetailPage } from "../features/places/pages/PlaceDetailPage";
import { PlacesPage } from "../features/places/pages/PlacesPage";
import { SubmitPlacePage } from "../features/places/pages/SubmitPlacePage";
import { AppShell } from "../shared/ui/AppShell";
import { useAuthStore } from "../features/auth/store/useAuthStore";

function ProtectedRoute({ allowedRoles }) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.user?.role);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="places" element={<PlacesPage />} />
          <Route path="places/:slug" element={<PlaceDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
            <Route path="account" element={<AccountPage />} />
            <Route path="submit-place" element={<SubmitPlacePage />} />
            <Route path="my-places/:placeId/edit" element={<SubmitPlacePage />} />
            <Route path="my-places" element={<MyPlacesPage />} />
            <Route path="my-reviews" element={<MyReviewsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/places" element={<AdminPlacesPage />} />
            <Route path="admin/reviews" element={<AdminReviewsPage />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { lazy, Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "./components/common/Layout";
import AuthLayout from "./components/auth/AuthLayout";
import { isAuthenticated, isAdmin } from "./utils/auth";
import LoadingSpinner from "./components/common/LoadingSpinner";

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

// Lazy load components
const DashboardPage = lazy(() => import("./pages/Dashboard/DashboardPage"));
const BookingsPage = lazy(() => import("./pages/bookings/BookingsPage"));
const FlightsPage = lazy(() => import("./pages/flights/FlightsPage"));
const HotelsPage = lazy(() => import("./pages/hotels/HotelsPage"));
const DestinationPage = lazy(() =>
  import("./pages/destinations/DestinationsPage")
);
const ProfilePage = lazy(() => import("./pages/profiles/ProfilesPage"));
const UserPage = lazy(() => import("./pages/users/UserPage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Protected Route Component
const RequireAuth = ({ children }) => {
  const isAuth = isAuthenticated();

  if (!isAuth) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

// Admin Route Component
const RequireAdmin = ({ children }) => {
  const isAuth = isAuthenticated();
  const isUserAdmin = isAdmin();

  if (!isAuth) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" replace />;
  }

  if (!isUserAdmin) {
    // Redirect to dashboard if not admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuth = isAuthenticated();

  if (isAuth) {
    // Redirect to dashboard if already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <RequireAuth>{withSuspense(DashboardPage)}</RequireAuth>,
      },
      {
        path: "dashboard",
        element: <RequireAuth>{withSuspense(DashboardPage)}</RequireAuth>,
      },
      {
        path: "bookings",
        element: <RequireAuth>{withSuspense(BookingsPage)}</RequireAuth>,
      },
      {
        path: "bookings/create",
        element: <RequireAuth>{withSuspense(BookingsPage)}</RequireAuth>,
      },
      {
        path: "bookings/:id/edit",
        element: <RequireAuth>{withSuspense(BookingsPage)}</RequireAuth>,
      },
      {
        path: "flights",
        element: <RequireAuth>{withSuspense(FlightsPage)}</RequireAuth>,
      },
      {
        path: "flights/create",
        element: <RequireAuth>{withSuspense(FlightsPage)}</RequireAuth>,
      },
      {
        path: "flights/:id/edit",
        element: <RequireAuth>{withSuspense(FlightsPage)}</RequireAuth>,
      },
      {
        path: "hotels",
        element: <RequireAuth>{withSuspense(HotelsPage)}</RequireAuth>,
      },
      {
        path: "hotels/create",
        element: <RequireAuth>{withSuspense(HotelsPage)}</RequireAuth>,
      },
      {
        path: "hotels/:id/edit",
        element: <RequireAuth>{withSuspense(HotelsPage)}</RequireAuth>,
      },
      {
        path: "destinations",
        element: <RequireAdmin>{withSuspense(DestinationPage)}</RequireAdmin>,
      },
      {
        path: "destinations/create",
        element: <RequireAdmin>{withSuspense(DestinationPage)}</RequireAdmin>,
      },
      {
        path: "destinations/:id/edit",
        element: <RequireAdmin>{withSuspense(DestinationPage)}</RequireAdmin>,
      },
      {
        path: "profile",
        element: <RequireAuth>{withSuspense(ProfilePage)}</RequireAuth>,
      },
      {
        path: "profile/create",
        element: <RequireAuth>{withSuspense(ProfilePage)}</RequireAuth>,
      },
      {
        path: "profile/:id/edit",
        element: <RequireAuth>{withSuspense(ProfilePage)}</RequireAuth>,
      },
      // User Management Routes (Admin Only)
      {
        path: "users",
        element: <RequireAdmin>{withSuspense(UserPage)}</RequireAdmin>,
      },
      {
        path: "users/create",
        element: <RequireAdmin>{withSuspense(UserPage)}</RequireAdmin>,
      },
      {
        path: "users/:id/edit",
        element: <RequireAdmin>{withSuspense(UserPage)}</RequireAdmin>,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { 
        path: "login", 
        element: <PublicRoute>{withSuspense(LoginPage)}</PublicRoute> 
      },
      { 
        path: "register", 
        element: <PublicRoute>{withSuspense(RegisterPage)}</PublicRoute> 
      },
    ],
  },
];
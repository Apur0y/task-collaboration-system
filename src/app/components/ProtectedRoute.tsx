import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "./store/hooks";
import Loader from "./Loader";


export default function ProtectedRoute() {
  const {isAuthenticated,isLoading} = useAppSelector(
    (state) => state.auth
  );
    if (isLoading) {
    return <Loader />;
  }

  console.log("Is",isAuthenticated);

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}
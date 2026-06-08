import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "./store/hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetmeQuery } from "./redux/authApi";
import { login, logout } from "./store/authSlice";
import Loader from "./Loader";

export function ProtectedRoute() {

  const dispatch = useDispatch();
  const [active,setActive] = useState(true)
  const { data, error, isLoading: queryIsLoading } = useGetmeQuery({});

  useEffect(() => {
    if (data) {
      dispatch(login(data.user));
      
    }

    if (error) {
      dispatch(logout());
      setActive(false)
    }

  }, [data, error, dispatch]);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Wait for the query to complete loading before making routing decisions
  if (queryIsLoading) {
      return <Loader />; // Or return a Loader component if you have one
  }

  if (!active) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

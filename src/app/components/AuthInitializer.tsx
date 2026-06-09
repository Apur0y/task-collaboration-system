// components/AuthInitializer.tsx

import { ReactNode, useEffect } from "react";
import { useGetmeQuery } from "./redux/authApi";
import Loader from "../components/Loader";
import { useAppDispatch } from "./store/hooks";
import { login, logout } from "./store/authSlice";

interface Props {
  children: ReactNode;
}

export default function AuthInitializer({ children }: Props) {
  const dispatch = useAppDispatch();

  const {
    data,
    isLoading,
    isSuccess,
    isError,
  } = useGetmeQuery(undefined);

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(login(data.data));
    }

    if (isError) {
      dispatch(logout());
    }
  }, [data, isSuccess, isError, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
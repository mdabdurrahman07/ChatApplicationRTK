import React from "react";
import { Outlet } from "react-router-dom";
import { useAuthCheck } from "../hooks/useAuthCheck";
import Loading from "../components/Loading/Loading";

const Root = () => {
  const auth = useAuthCheck();
  return !auth ? (
    <Loading />
  ) : (
    <div>
      <Outlet />
    </div>
  );
};

export default Root;

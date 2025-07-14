import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";

function Basic() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default Basic;

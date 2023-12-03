import { FC, ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectAuthState } from "../slices/authSlice";

type ProtectedRouteProps = {
  children: ReactElement,
  hidden?: boolean,
}

const ProtectedElement: FC<ProtectedRouteProps> = ({
  children,
  hidden = false,
}): ReactElement => {
  const { authenticated } = useAppSelector(selectAuthState);
  const location = useLocation();
  if (!authenticated) {
    if (!hidden) {
      return (
        <Navigate
          replace
          to={{
            pathname: "/sign-in",
            search: `?next=${location.pathname}`
          }}
        />
      );
    }
    return (<></>);
  }
  return children;
}

export default ProtectedElement;
import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthentication } from "../hooks/auth";

type ProtectedRouteProps = {
  children: ReactElement,
}

const ProtectedElement: FC<ProtectedRouteProps> = ({
  children,
}): ReactElement => {
  const { authenticated } = useAuthentication();
  if (!authenticated) {
    return (<Navigate to="/sign-in" replace />);
  }
  return children;
}

export default ProtectedElement;
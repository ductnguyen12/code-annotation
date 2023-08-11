import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuthentication } from "../hooks/auth";

type ProtectedRouteProps = {
  children: ReactElement,
  hidden?: boolean,
}

const ProtectedElement: FC<ProtectedRouteProps> = ({
  children,
  hidden = false,
}): ReactElement => {
  const { authenticated } = useAuthentication();
  if (!authenticated) {
    if (!hidden)
      return (<Navigate to="/sign-in" replace />);
    return (<></>);
  }
  return children;
}

export default ProtectedElement;
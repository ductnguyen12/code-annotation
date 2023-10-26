import { FC, ReactElement } from "react";
import { Navigate } from "react-router-dom";
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
  if (!authenticated) {
    if (!hidden)
      return (<Navigate to="/sign-in" replace />);
    return (<></>);
  }
  return children;
}

export default ProtectedElement;
import { useEffect } from "react";
import {
  Navigate,
  Route,
  Routes, useLocation
} from "react-router-dom";

import { Container } from "@mui/material";

import { useAppDispatch } from "../app/hooks";
import routes from "../app/routes";
import { changeTitle } from "../components/App/appSlice";
import DrawerHeader from "../components/AppDrawer/DrawerHeader";
import ProtectedElement from "../components/ProtectedElement";
import { useAuthentication } from "../hooks/auth";

export default function Pages() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useAuthentication();

  useEffect(() => {
    // Find specific currently using route
    const foundRoute = routes.find(r => {
      const routePathTokens = r.path.split('/');
      const currentTokens = location.pathname.split('/');
      return currentTokens.length === routePathTokens.length
        && location.pathname.startsWith(r.drawerPathPrefix || 'null');
    });
    if (foundRoute) {
      dispatch(changeTitle(foundRoute.title));
    }
  })

  return (
    <Container
      maxWidth="lg"
      sx={{
        padding: 3,
      }}
    >
      <DrawerHeader />
      <Routes>
        {routes.map(r => !r.protected
          ? (<Route key={r.key} path={r.path} element={r.element} />)
          : (
            <Route key={r.key} path={r.path} element={(
              <ProtectedElement>
                {r.element}
              </ProtectedElement>
            )} />
          )
        )}
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </Container>
  )
}
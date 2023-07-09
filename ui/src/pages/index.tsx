import { FC, ReactElement, useEffect } from "react";
import {
  Navigate,
  Route,
  Routes, useLocation
} from "react-router-dom";

import { Theme, styled, useTheme } from "@mui/material";

import { useAppDispatch } from "../app/hooks";
import routes from "../app/routes";
import { changeTitle } from "../components/App/appSlice";
import DrawerHeader from "../components/AppDrawer/DrawerHeader";
import ProtectedElement from "../components/ProtectedElement";


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth' })(
  ({ theme, open, drawerWidth }: {
    theme: Theme,
    open: boolean,
    drawerWidth: number,
  }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
    height: '100%',
  }),
);

type PagesProps = {
  open: boolean,
  drawerWidth: number,
}

const Pages: FC<PagesProps> = ({
  open,
  drawerWidth,
}): ReactElement => {
  const theme: Theme = useTheme();
  const location = useLocation();
  const dispatch = useAppDispatch();

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
    <Main
      theme={theme}
      open={open}
      drawerWidth={drawerWidth}
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
    </Main>
  )
}

export default Pages;
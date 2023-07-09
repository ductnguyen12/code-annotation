import { FC, ReactElement } from "react";

import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Theme, useTheme } from '@mui/material/styles';

import AppBar from "./AppBar";


type AppHeaderProps = {
  title: string,
  open: boolean,
  drawerWidth: number,
  handleDrawerOpen: () => void,
}

const AppHeader: FC<AppHeaderProps> = ({
  title,
  open,
  drawerWidth,
  handleDrawerOpen,
}): ReactElement => {
  const theme: Theme = useTheme();

  return (
    <AppBar
      position="fixed"
      open={open}
      drawerWidth={drawerWidth}
      theme={theme}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
};

export default AppHeader;
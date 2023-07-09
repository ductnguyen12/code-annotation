import { FC, ReactElement } from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Theme, useTheme } from '@mui/material/styles';

import {
  Link as RouterLink, useLocation,
} from 'react-router-dom';
import routes from '../../app/routes';
import DrawerHeader from './DrawerHeader';

type AppDrawerProps = {
  open: boolean,
  drawerWidth: number,
  handleDrawerClose: () => void,
}

const AppDrawer: FC<AppDrawerProps> = ({
  open,
  drawerWidth,
  handleDrawerClose,
}): ReactElement => {
  const theme: Theme = useTheme();
  const location = useLocation();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {routes.filter(r => r.inDrawer).map(r => (
          <ListItem
            key={r.key}
            disablePadding
          >
            <ListItemButton
              selected={location.pathname.startsWith(r.drawerPathPrefix || 'null')}
              component={RouterLink}
              to={r.path}
            >
              <ListItemIcon>
                {r.icon}
              </ListItemIcon>
              <ListItemText primary={r.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default AppDrawer;
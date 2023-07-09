import React, { FC, ReactElement } from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { useAppSelector } from '../../app/hooks';
import Pages from '../../pages';
import AppDrawer from '../AppDrawer';
import AppHeader from '../AppHeader';
import { selectTitle } from './appSlice';

const drawerWidth = 240;

const App: FC = (): ReactElement => {
  const [open, setOpen] = React.useState(false);
  const title = useAppSelector(selectTitle);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppHeader
        title={title}
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerOpen={handleDrawerOpen}
      />
      <AppDrawer
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerClose={handleDrawerClose}
      />
      <Pages
        open={open}
        drawerWidth={drawerWidth}
      />
    </Box>
  );
}

export default App;

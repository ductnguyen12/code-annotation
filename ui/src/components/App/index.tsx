import React, { useCallback } from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { useAppSelector } from '../../app/hooks';
import { useNotifier } from '../../hooks/notifier';
import Pages from '../../pages';
import AppDrawer from '../AppDrawer';
import AppHeader from '../AppHeader';
import { selectTitle } from './appSlice';

const drawerWidth = 240;

export default function App() {
  useNotifier();
  const [open, setOpen] = React.useState(false);
  const title = useAppSelector(selectTitle);

  const handleDrawerOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Box
      sx={{ display: 'flex' }}
      onClick={() => {
        if (open)
          handleDrawerClose();
      }}
    >
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
      />
    </Box>
  );
}
import { FC, ReactElement } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

type AppDialogProps = {
  title: string,
  open: boolean,
  children: ReactElement,
  setOpen: (open: boolean) => void,
  onClose: () => void,
  onConfirm: () => void,
}

const AppDialog: FC<AppDialogProps> = ({
  title,
  open,
  children,
  setOpen,
  onClose,
  onConfirm,
}): ReactElement => {

  const handleClose = () => {
    onClose();
    setOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AppDialog;
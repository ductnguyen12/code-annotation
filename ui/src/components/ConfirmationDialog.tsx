import Button from '@mui/material/Button';

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from "@mui/material/DialogTitle";
import { useCallback } from 'react';

export default function ConfirmationDialog({
  title,
  content,
  open,
  confirmColor,
  setOpen,
  onConfirm,
  onCancel,
}: {
  title: string,
  content?: string,
  open: boolean,
  confirmColor?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  setOpen: (open: boolean) => void,
  onConfirm?: () => void,
  onCancel?: () => void,
}) {

  const handleClose = useCallback(() => {
    onCancel && onCancel();
    setOpen(false);
  }, [onCancel, setOpen]);

  const handleConfirm = useCallback(() => {
    onConfirm && onConfirm();
    handleClose();
  }, [handleClose, onConfirm]);

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content || ''}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color={confirmColor || 'primary'} onClick={handleConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}
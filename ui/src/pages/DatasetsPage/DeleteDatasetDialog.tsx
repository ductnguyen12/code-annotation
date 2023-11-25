import Button from '@mui/material/Button';

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { chooseDataset, deleteDatasetAsync, selectDatasetsState } from "../../slices/datasetsSlice";

const DeleteDatasetDialog = ({
  open,
  setOpen,
}: {
  open: boolean,
  setOpen: (open: boolean) => void,
}) => {
  const dispatch = useAppDispatch();

  const {
    dataset,
  } = useAppSelector(selectDatasetsState);

  const handleDelete = () => {
    dispatch(deleteDatasetAsync(dataset?.id as number));
    handleClose();
  }

  const handleClose = () => {
    dispatch(chooseDataset(-1));
    setOpen(false);
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Are you sure to delete this dataset?</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDelete}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDatasetDialog;
import Button from '@mui/material/Button';

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useAppDispatch } from "../../app/hooks";
import { Dataset } from "../../interfaces/dataset.interface";
import { deleteDatasetAsync } from "../../slices/datasetsSlice";

const DeleteDatasetDialog = ({
  dataset,
  onCancel,
}: {
  dataset?: Dataset,
  onCancel: () => void;
}) => {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(deleteDatasetAsync(dataset?.id as number));
    onCancel();
  }

  return (
    <Dialog fullWidth open={!!dataset} onClose={onCancel}>
      <DialogTitle>Are you sure to delete this dataset?</DialogTitle>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleDelete}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDatasetDialog;
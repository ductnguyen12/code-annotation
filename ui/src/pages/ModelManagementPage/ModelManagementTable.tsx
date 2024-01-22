import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";

import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { useModels } from '../../hooks/model';
import { Model } from "../../interfaces/model.interface";
import { deleteModelAsync, setOpenDialog, setSelected } from '../../slices/modelSlice';

const headers = [
  "ID",
  "Name",
  "Execution Type",
  "Output Format",
  "Rating scale",
  "Actions",
];

const fields: (keyof Model)[] = [
  "id",
  "name",
  "executionType",
  "outputFormat",
  "ratingScale",
];

const ModelManagementTable = () => {
  const {
    models,
    selected,
  } = useModels();

  const dispatch = useAppDispatch();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEdit = useCallback((model: Model) => {
    dispatch(setSelected(model));
    dispatch(setOpenDialog(true));
  }, [dispatch]);

  const handleStartDeleting = useCallback((model: Model) => {
    dispatch(setSelected(model));
    setOpenDeleteDialog(true);
  }, [dispatch]);

  const handleDeleting = useCallback(() => {
    dispatch(deleteModelAsync(selected?.id as number));
  }, [dispatch, selected]);

  const handleCancelDeleting = useCallback(() => {
    dispatch(setSelected(undefined));
  }, [dispatch]);

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (<TableCell key={index} align="center">{header}</TableCell>))}
        </TableRow>
      </TableHead>
      <TableBody>
        {models.map((model, index) => (
          <TableRow
            key={index}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            {fields.map((field) => (
              <TableCell key={field} align="center">{model[field] as string}</TableCell>
            ))}
            <TableCell key="actions" align="center">
              <IconButton aria-label="Edit model" onClick={() => handleEdit(model)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="Delete model" onClick={() => handleStartDeleting(model)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <ConfirmationDialog
        title="Are you sure to delete this model?"
        content="Deleting this model will cascade deleting predictions that this model produced."
        confirmColor="error"
        open={openDeleteDialog}
        setOpen={(open: boolean) => setOpenDeleteDialog(open)}
        onConfirm={handleDeleting}
        onCancel={handleCancelDeleting}
      />
    </Table>
  );
}

export default ModelManagementTable;
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

import { useAppDispatch } from '../../app/hooks';
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
  } = useModels();

  const dispatch = useAppDispatch();

  const handleEdit = (model: Model) => {
    dispatch(setSelected(model));
    dispatch(setOpenDialog(true));
  };

  const handleDelete = (model: Model) => {
    dispatch(deleteModelAsync(model.id as number));
  };

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
              <IconButton aria-label="Delete model" onClick={() => handleDelete(model)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ModelManagementTable;
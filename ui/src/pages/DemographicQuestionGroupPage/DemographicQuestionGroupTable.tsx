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
import { useDemographicQuestionGroups } from '../../hooks/demographicQuestion';
import { DemographicQuestionGroup } from "../../interfaces/question.interface";
import { deleteDemographicQuestionGroupAsync, setOpenDialog, setSelected } from '../../slices/demographicQuestionGroupSlice';

const DemographicQuestionGroupTable = () => {
  const {
    questionGroups,
  } = useDemographicQuestionGroups();

  const dispatch = useAppDispatch();

  const handleEdit = (group: DemographicQuestionGroup) => {
    dispatch(setSelected(group));
    dispatch(setOpenDialog(true));
  };

  const handleDelete = (group: DemographicQuestionGroup) => {
    dispatch(deleteDemographicQuestionGroupAsync(group.id as number));
  };

  const headers = [
    "ID",
    "Title",
    "Description",
    "Priority",
    "Actions",
  ];

  const fields: (keyof DemographicQuestionGroup)[] = [
    "id",
    "title",
    "description",
    "priority",
  ];

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (<TableCell key={index} align="center">{header}</TableCell>))}
        </TableRow>
      </TableHead>
      <TableBody>
        {questionGroups.map((group, index) => (
          <TableRow
            key={index}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            {fields.map((field) => (
              <TableCell key={field}>{group[field] as string}</TableCell>
            ))}
            <TableCell key="actions">
              <IconButton aria-label="Edit question group" onClick={() => handleEdit(group)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="Delete question group" onClick={() => handleDelete(group)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DemographicQuestionGroupTable;
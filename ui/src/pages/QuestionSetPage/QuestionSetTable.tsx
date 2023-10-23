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
import { useQuestionSets } from '../../hooks/questionSet';
import { QuestionSet } from "../../interfaces/question.interface";
import { deleteQuestionSetAsync, setOpenDialog, setSelected } from '../../slices/questionSetSlice';

const QuestionSetTable = () => {
  const {
    questionSets,
  } = useQuestionSets();

  const dispatch = useAppDispatch();

  const handleEdit = (questionSet: QuestionSet) => {
    dispatch(setSelected(questionSet));
    dispatch(setOpenDialog(true));
  };

  const handleDelete = (questionSet: QuestionSet) => {
    dispatch(deleteQuestionSetAsync(questionSet.id as number));
  };

  const headers = [
    "ID",
    "Title",
    "Description",
    "Actions",
  ];

  const fields: (keyof QuestionSet)[] = [
    "id",
    "title",
    "description",
  ];

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (<TableCell key={index} align="center">{header}</TableCell>))}
        </TableRow>
      </TableHead>
      <TableBody>
        {questionSets.map((questionSet, index) => (
          <TableRow
            key={index}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            {fields.map((field) => (
              <TableCell key={field}>{questionSet[field]}</TableCell>
            ))}
            <TableCell key="actions">
              <IconButton aria-label="Edit question group" onClick={() => handleEdit(questionSet)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="Delete question group" onClick={() => handleDelete(questionSet)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default QuestionSetTable;
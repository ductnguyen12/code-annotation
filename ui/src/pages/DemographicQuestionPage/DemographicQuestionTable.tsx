import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useDemographicQuestions } from '../../hooks/demographicQuestion';
import { DemographicQuestion } from "../../interfaces/question.interface";
import { selectDemographicQuestionGroupState } from '../../slices/demographicQuestionGroupSlice';
import { deleteDemographicQuestionAsync, setOpenDialog, setSelected } from '../../slices/demographicQuestionSlice';

const DemographicQuestionTable = () => {
  const {
    questionGroups,
  } = useAppSelector(selectDemographicQuestionGroupState);

  const {
    questions,
  } = useDemographicQuestions();

  const dispatch = useAppDispatch();

  const handleEdit = (question: DemographicQuestion) => {
    dispatch(setSelected(question));
    dispatch(setOpenDialog(true));
  };

  const handleDelete = (question: DemographicQuestion) => {
    dispatch(deleteDemographicQuestionAsync(question.id as number));
  };

  const headers = [
    "ID",
    "Content",
    "Question type",
    "Question group",
    "Actions",
  ];

  const fields: (keyof DemographicQuestion)[] = [
    "id",
    "content",
    "type",
  ];

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (<TableCell key={index} align="center">{header}</TableCell>))}
        </TableRow>
      </TableHead>
      <TableBody>
        {questions.map((question, index) => (
          <TableRow
            key={index}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            {fields.map((field) => (
              <TableCell key={field}>{question[field] as string}</TableCell>
            ))}
            <TableCell
              key="questionGroups"
              align="center"
              sx={{
                maxWidth: '350px',
              }}
            >
              {questionGroups
                .filter(group => question.groupIds?.includes(group.id as number))
                .map(group => (
                  <Chip
                    key={group.id}
                    label={group.title}
                    sx={{
                      m: 0.5,
                    }}
                  />
                ))}
            </TableCell>
            <TableCell
              key="actions"
              align="center"
            >
              <IconButton aria-label="Edit question" onClick={() => handleEdit(question)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="Delete question" onClick={() => handleDelete(question)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DemographicQuestionTable;
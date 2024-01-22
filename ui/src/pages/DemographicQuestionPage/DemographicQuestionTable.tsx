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

import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { useDemographicQuestions } from '../../hooks/demographicQuestion';
import { DemographicQuestion } from "../../interfaces/question.interface";
import { selectDemographicQuestionGroupState } from '../../slices/demographicQuestionGroupSlice';
import { deleteDemographicQuestionAsync, setOpenDialog, setSelected } from '../../slices/demographicQuestionSlice';

const headers = [
  "ID",
  "ParentID",
  "Content",
  "Question type",
  "Question group",
  "Actions",
];

const fields: (keyof DemographicQuestion)[] = [
  "id",
  "parentId",
  "content",
  "type",
];

const align: ('inherit' | 'left' | 'center' | 'right' | 'justify')[] = [
  "center",
  "center",
  "left",
  "center",
];

const DemographicQuestionTable = () => {
  const {
    questionGroups,
  } = useAppSelector(selectDemographicQuestionGroupState);

  const {
    questions,
    selected,
  } = useDemographicQuestions();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const dispatch = useAppDispatch();

  const handleEdit = (question: DemographicQuestion) => {
    dispatch(setSelected(question));
    dispatch(setOpenDialog(true));
  };

  const handleStartDeleting = useCallback((question: DemographicQuestion) => {
    dispatch(setSelected(question));
    setOpenDeleteDialog(true);
  }, [dispatch]);

  const handleDeleting = useCallback(() => {
    dispatch(deleteDemographicQuestionAsync(selected?.id as number));
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
        {questions.map((question, index) => (
          <TableRow
            key={index}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            {fields.map((field, i) => (
              <TableCell key={field} align={align[i]} sx={{
                maxWidth: '600px',
                overflowWrap: 'break-word',
              }}>{
                  typeof question[field] !== 'string' || (question[field] as string).length < 512
                    ? (question[field] as string)
                    : (question[field] as string).substring(0, 512) + '...'
                }
              </TableCell>
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
              <IconButton aria-label="Delete question" onClick={() => handleStartDeleting(question)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <ConfirmationDialog
        title="Are you sure to delete this question?"
        content="Deleting a question will lead to deleting answers on this question."
        confirmColor="error"
        open={openDeleteDialog}
        setOpen={(open: boolean) => setOpenDeleteDialog(open)}
        onConfirm={handleDeleting}
        onCancel={handleCancelDeleting}
      />
    </Table>
  );
}

export default DemographicQuestionTable;
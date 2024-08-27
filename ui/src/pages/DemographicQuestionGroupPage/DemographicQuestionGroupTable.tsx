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

import DOMPurify from 'dompurify';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { useDemographicQuestionGroups } from '../../hooks/demographicQuestion';
import { DemographicQuestionGroup } from "../../interfaces/question.interface";
import { deleteDemographicQuestionGroupAsync, setOpenDialog, setSelected } from '../../slices/demographicQuestionGroupSlice';

const DemographicQuestionGroupTable = () => {
  const {
    questionGroups,
    selected,
  } = useDemographicQuestionGroups();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const dispatch = useAppDispatch();

  const handleEdit = useCallback((group: DemographicQuestionGroup) => {
    dispatch(setSelected(group));
    dispatch(setOpenDialog(true));
  }, [dispatch]);

  const handleStartDeleting = useCallback((group: DemographicQuestionGroup) => {
    dispatch(setSelected(group));
    setOpenDeleteDialog(true);
  }, [dispatch]);

  const handleDeleting = useCallback(() => {
    dispatch(deleteDemographicQuestionGroupAsync(selected?.id as number));
  }, [dispatch, selected]);

  const handleCancelDeleting = useCallback(() => {
    dispatch(setSelected(undefined));
  }, [dispatch]);

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

  const richTextFields = [
    "description",
  ]

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
              <TableCell key={field}>
                {richTextFields.includes(field)
                  ? (<div
                    className="inline-block"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(group[field] as string)
                    }}
                  />)
                  : group[field] as string}
              </TableCell>
            ))}
            <TableCell key="actions">
              <IconButton aria-label="Edit question group" onClick={() => handleEdit(group)}>
                <EditIcon />
              </IconButton>
              <IconButton aria-label="Delete question group" onClick={() => handleStartDeleting(group)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <ConfirmationDialog
        title="Are you sure to delete this question group?"
        confirmColor="error"
        open={openDeleteDialog}
        setOpen={(open: boolean) => setOpenDeleteDialog(open)}
        onConfirm={handleDeleting}
        onCancel={handleCancelDeleting}
      />
    </Table>
  );
}

export default DemographicQuestionGroupTable;
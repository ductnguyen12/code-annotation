import { TextField } from "@mui/material"
import { ReactElement } from "react"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import FormDialog from "../../components/FormDialog"
import { QuestionSet } from "../../interfaces/question.interface"
import { createQuestionSetAsync, selectQuestionSetState, setOpenDialog, updateQuestionSetAsync } from "../../slices/questionSetSlice"


const QuestionSetDialog = (): ReactElement => {
  const { register, handleSubmit } = useForm<QuestionSet>();
  const {
    openDialog,
    selected,
  } = useAppSelector(selectQuestionSetState);

  const dispatch = useAppDispatch();

  const onSubmission = async (questionSet: QuestionSet) => {
    if (!!selected) {
      dispatch(updateQuestionSetAsync({ questionSetId: selected.id as number, questionSet }));
    } else {
      dispatch(createQuestionSetAsync(questionSet));
    }
    return questionSet;
  };

  const title = !!selected ? `Edit Question Set ID ${selected.id}` : "Create Question Set";

  return (
    <FormDialog<QuestionSet>
      title={title}
      open={openDialog}
      setOpen={(open: boolean) => dispatch(setOpenDialog(open))}
      onSubmit={onSubmission}
      handleSubmit={handleSubmit}
    >
      <TextField
        id="title"
        label="Title"
        variant="outlined"
        {...register('title')}
      />
      <TextField
        id="description"
        label="Description"
        variant="outlined"
        {...register('description')}
      />
      <TextField
        id="priority"
        label="Priority"
        variant="outlined"
        placeholder="0"
        {...register('priority')}
      />
    </FormDialog>
  );
};

export default QuestionSetDialog;
import { TextField } from "@mui/material"
import { ReactElement, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import FormDialog from "../../components/FormDialog"
import { QuestionSet } from "../../interfaces/question.interface"
import { createQuestionSetAsync, selectQuestionSetState, setOpenDialog, setSelected, updateQuestionSetAsync } from "../../slices/questionSetSlice"


const QuestionSetDialog = (): ReactElement => {
  const { register, handleSubmit, setValue } = useForm<QuestionSet>();
  const {
    openDialog,
    selected,
  } = useAppSelector(selectQuestionSetState);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selected) {
      (Object.keys(selected) as (keyof QuestionSet)[]).forEach(key => setValue(key, selected[key]));
    }
  }, [selected, setValue])

  const onSubmission = async (questionSet: QuestionSet) => {
    if (!!selected) {
      dispatch(updateQuestionSetAsync({ questionSetId: selected.id as number, questionSet }));
    } else {
      dispatch(createQuestionSetAsync(questionSet));
    }
    return questionSet;
  };

  const title = !!selected ? `Edit Question Group ID ${selected.id}` : "Create Question Group";

  return (
    <FormDialog<QuestionSet>
      title={title}
      open={openDialog}
      setOpen={(open: boolean) => dispatch(setOpenDialog(open))}
      onSubmit={onSubmission}
      onClose={() => dispatch(setSelected(undefined))}
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
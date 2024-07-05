import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { ReactElement, useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import FormDialog from "../../components/FormDialog"
import QuestionPriorityFormControl from "../../components/QuestionPriorityFormControl"
import { DemographicQuestionGroup } from "../../interfaces/question.interface"
import { createDemographicQuestionGroupAsync, selectDemographicQuestionGroupState, setOpenDialog, setSelected, updateDemographicQuestionGroupAsync } from "../../slices/demographicQuestionGroupSlice"

const IGNORE_FIELDS = [
  'priorityMap',
]

const DemographicQuestionGroupDialog = (): ReactElement => {
  const {
    openDialog,
    selected,
  } = useAppSelector(selectDemographicQuestionGroupState);

  const methods = useForm<DemographicQuestionGroup>();
  const { register, handleSubmit, setValue, reset } = methods;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selected) {
      (Object.keys(selected) as (keyof DemographicQuestionGroup)[])
        .filter(key => !IGNORE_FIELDS.includes(key))
        .forEach(key => setValue(key, selected[key]));
    }
  }, [selected, setValue])

  const onSubmission = async (group: DemographicQuestionGroup) => {
    if (!!selected) {
      dispatch(updateDemographicQuestionGroupAsync({ groupId: selected.id as number, group }));
    } else {
      dispatch(createDemographicQuestionGroupAsync(group));
    }
    return group;
  };

  const title = !!selected ? `Edit Question Group ID ${selected.id}` : "Create Question Group";

  return (
    <FormDialog<DemographicQuestionGroup>
      title={title}
      open={openDialog}
      onSubmit={onSubmission}
      onClose={() => {
        dispatch(setSelected(undefined));
        dispatch(setOpenDialog(false));
        reset();
      }}
      handleSubmit={handleSubmit}
    >
      <FormProvider {...methods}>
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          {...register('title', {
            required: true,
          })}
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
        {selected?.questions?.length && (
          <>
            <Typography variant="subtitle1" display="block" gutterBottom>
              Question priority
            </Typography>
            <QuestionPriorityFormControl
              questions={selected.questions}
            />
          </>
        )}
      </FormProvider>
    </FormDialog>
  );
};

export default DemographicQuestionGroupDialog;
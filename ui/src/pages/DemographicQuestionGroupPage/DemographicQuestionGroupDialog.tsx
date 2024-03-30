import { TextField } from "@mui/material"
import { ReactElement, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import FormDialog from "../../components/FormDialog"
import { DemographicQuestionGroup } from "../../interfaces/question.interface"
import { createDemographicQuestionGroupAsync, selectDemographicQuestionGroupState, setOpenDialog, setSelected, updateDemographicQuestionGroupAsync } from "../../slices/demographicQuestionGroupSlice"


const DemographicQuestionGroupDialog = (): ReactElement => {
  const { register, handleSubmit, setValue } = useForm<DemographicQuestionGroup>();
  const {
    openDialog,
    selected,
  } = useAppSelector(selectDemographicQuestionGroupState);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selected) {
      (Object.keys(selected) as (keyof DemographicQuestionGroup)[]).forEach(key => setValue(key, selected[key]));
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
      }}
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

export default DemographicQuestionGroupDialog;
import { TextField } from "@mui/material"
import { FC, ReactElement } from "react"
import { useForm } from "react-hook-form"
import api from "../../api"
import { useAppDispatch } from "../../app/hooks"
import FormDialog from "../../components/FormDialog"
import { Dataset } from "../../interfaces/dataset.interface"
import { pushNotification } from "../../slices/notificationSlice"
import { defaultAPIErrorHandle } from "../../util/error-util"

type CreateDatasetDialogProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  onCreated?: (dataset: Dataset) => void,
}

const CreateDatasetDialog: FC<CreateDatasetDialogProps> = ({
  open,
  setOpen,
  onCreated,
}): ReactElement => {
  const { register, handleSubmit } = useForm<Dataset>();
  const dispatch = useAppDispatch();

  const onCreateDataset = async (dataset: Dataset) => {
    try {
      const newDataset = await api.createDataset(dataset);
      dispatch(pushNotification({ message: `Dataset '${newDataset.id}' was created successfully`, variant: 'success' }));
      return newDataset;
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }

  return (
    <FormDialog<Dataset>
      title="Create Dataset"
      open={open}
      setOpen={setOpen}
      onSubmit={onCreateDataset}
      onSuccess={onCreated}
      handleSubmit={handleSubmit}
    >
      <TextField
        id="name"
        label="Name"
        variant="outlined"
        {...register('name')}
      />
      <TextField
        id="description"
        label="Description"
        variant="outlined"
        rows={3}
        {...register('description')}
      />
    </FormDialog>
  );
}

export default CreateDatasetDialog;
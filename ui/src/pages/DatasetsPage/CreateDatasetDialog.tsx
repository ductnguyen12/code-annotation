import { TextField } from "@mui/material"
import { FC, ReactElement } from "react"
import { useForm } from "react-hook-form"
import api from "../../api"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import FormDialog from "../../components/FormDialog"
import { Dataset } from "../../interfaces/dataset.interface"
import { selectDatasetsState } from "../../slices/datasetsSlice"
import { pushNotification } from "../../slices/notificationSlice"
import { defaultAPIErrorHandle } from "../../util/error-util"
import RaterMgmtSelector from "./RaterMgmtSelector"

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

  const {
    configuration,
  } = useAppSelector(selectDatasetsState);

  const onCreateDataset = async (dataset: Dataset) => {
    dataset.configuration = configuration;

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
        size="small"
        {...register('name')}
      />
      <TextField
        id="description"
        label="Description"
        variant="outlined"
        size="small"
        multiline
        rows={3}
        {...register('description')}
      />
      <RaterMgmtSelector />
    </FormDialog>
  );
}

export default CreateDatasetDialog;
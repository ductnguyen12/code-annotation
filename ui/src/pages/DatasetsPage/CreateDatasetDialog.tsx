import { TextField } from "@mui/material"
import { FC, ReactElement } from "react"
import { useForm } from "react-hook-form"
import api from "../../api"
import FormDialog from "../../components/FormDialog"
import { Dataset } from "../../interfaces/dataset.interface"

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

  const onCreateDataset = async (dataset: Dataset) => {
    return await api.createDataset(dataset);
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
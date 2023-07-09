import { Box, TextField } from "@mui/material"
import React, { FC, ReactElement, RefObject } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import AppDialog from "../../components/AppDialog"
import { Dataset } from "../../interfaces/dataset.interface"

type CreateDatasetDialogProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  onCreateDataset: (dataset: Dataset) => Promise<void>,
}

const CreateDatasetDialog: FC<CreateDatasetDialogProps> = ({
  open,
  setOpen,
  onCreateDataset,
}): ReactElement => {
  let form: RefObject<HTMLFormElement> = React.createRef();
  const { register, handleSubmit } = useForm<Dataset>();

  const handleConfirm = () => {
    if (form.current) {
      form.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      )
    }
  }

  const onSubmit: SubmitHandler<Dataset> = (dataset: Dataset) => {
    onCreateDataset(dataset)
      .then(() => {
        setOpen(false);    
      })
  }

  return (
    <AppDialog
      title="Create Dataset"
      open={open}
      setOpen={setOpen}
      onClose={() => { }}
      onConfirm={handleConfirm}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        ref={form}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          p: 2,
          gap: 2,
        }}
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
      </Box>
    </AppDialog>
  )
}

export default CreateDatasetDialog;
import { Box, TextField } from "@mui/material"
import React, { FC, ReactElement, RefObject } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import AppDialog from "../../components/AppDialog"
import { Snippet } from "../../interfaces/snippet.interface"

type CreateSnippetDialogProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  onCreateSnippet: (snippet: Snippet) => Promise<Snippet>,
}

const CreateSnippetDialog: FC<CreateSnippetDialogProps> = ({
  open,
  setOpen,
  onCreateSnippet,
}): ReactElement => {
  let form: RefObject<HTMLFormElement> = React.createRef();
  const { register, handleSubmit } = useForm<Snippet>();

  const handleConfirm = () => {
    if (form.current) {
      form.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      )
    }
  }

  const onSubmit: SubmitHandler<Snippet> = (snippet: Snippet) => {
    onCreateSnippet(snippet)
      .then(() => {
        setOpen(false);
      })
  }

  return (
    <AppDialog
      title="Create Snippet"
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
          id="path"
          label="Path"
          variant="outlined"
          placeholder="https://github.com/scylladb/seastar/blob/master/src/core/alien.cc"
          {...register('path')}
        />
        <TextField
          id="fromLine"
          label="From line"
          variant="outlined"
          placeholder="1"
          {...register('fromLine')}
        />
        <TextField
          id="toLine"
          label="To line"
          variant="outlined"
          placeholder="100"
          {...register('toLine')}
        />
      </Box>
    </AppDialog>
  )
}

export default CreateSnippetDialog;
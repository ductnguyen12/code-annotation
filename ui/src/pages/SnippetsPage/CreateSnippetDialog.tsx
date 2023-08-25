import { TextField } from "@mui/material"
import { FC, ReactElement } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import api from "../../api"
import FormDialog from "../../components/FormDialog"
import { Snippet } from "../../interfaces/snippet.interface"

type CreateSnippetDialogProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  onCreated?: (snippet: Snippet) => void,
}

const CreateSnippetDialog: FC<CreateSnippetDialogProps> = ({
  open,
  setOpen,
  onCreated,
}): ReactElement => {
  const { register, handleSubmit } = useForm<Snippet>();
  const { id } = useParams<{ id: string }>();

  const onCreateSnippet = async (snippet: Snippet) => {
    if (id) {
      snippet.datasetId = parseInt(id);
      return await api.createSnippet(snippet);
    }
    return snippet;
  };

  return (
    <FormDialog<Snippet>
      title="Create Snippet"
      open={open}
      setOpen={setOpen}
      onSubmit={onCreateSnippet}
      onSuccess={onCreated}
      handleSubmit={handleSubmit}
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
    </FormDialog>
  );
};

export default CreateSnippetDialog;
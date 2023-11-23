import { TextField } from "@mui/material"
import { FC, ReactElement } from "react"
import { useForm } from "react-hook-form"
import api from "../../../../api"
import { useAppDispatch } from "../../../../app/hooks"
import FormDialog from "../../../../components/FormDialog"
import { useIdFromPath } from "../../../../hooks/common"
import { Snippet } from "../../../../interfaces/snippet.interface"
import { pushNotification } from "../../../../slices/notificationSlice"
import { defaultAPIErrorHandle } from "../../../../util/error-util"

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
  const datasetId = useIdFromPath();
  const dispatch = useAppDispatch();

  const onCreateSnippet = async (snippet: Snippet) => {
    if (datasetId) {
      snippet.datasetId = datasetId;
      try {
        const newSnippet = await api.createSnippet(snippet);
        dispatch(pushNotification({ message: `Snippet '${newSnippet.id}' was created successfully`, variant: 'success' }));
        return newSnippet;
      } catch (error: any) {
        defaultAPIErrorHandle(error, dispatch);
        throw error;
      }
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
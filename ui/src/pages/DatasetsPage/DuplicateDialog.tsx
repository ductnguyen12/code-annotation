import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { FormProvider, useForm } from "react-hook-form";
import FormDialog from "../../components/FormDialog";

export default function DuplicateDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean,
  onClose?: () => void,
  onSubmit?: (params: any) => void,
}) {
  const methods = useForm<any>();
  const { register, reset, handleSubmit, } = methods;

  return (
    <FormDialog<any>
      title="Duplicate dataset"
      open={open}
      onClose={() => {
        reset();
        onClose && onClose();
      }}
      onSubmit={async (value: any) => onSubmit && onSubmit(value)}
      handleSubmit={handleSubmit}
    >
      <FormProvider {...methods}>
        <FormControlLabel
          control={
            <Checkbox />
          }
          label="Also duplicates snippets"
          {...register('withSnippet')}
        />
      </FormProvider>
    </FormDialog>
  )
}
import { TextField } from "@mui/material"
import { FC, ReactElement } from "react"
import { useForm } from "react-hook-form"
import api from "../../api"
import FormDialog from "../../components/FormDialog"
import { Rater } from "../../interfaces/rater.interface"

type RaterRegistrationDialogProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  onRegistered: (rater: Rater) => void,
}

const RaterRegistrationDialog: FC<RaterRegistrationDialogProps> = ({
  open,
  setOpen,
  onRegistered,
}): ReactElement => {
  const { register, handleSubmit } = useForm<Rater>();

  const onRaterRegistration = async (rater: Rater) => {
    return await api.registerAsRater(rater);
  };

  return (
    <FormDialog<Rater>
      title="Register as a rater"
      open={open}
      setOpen={setOpen}
      onSubmit={onRaterRegistration}
      onSuccess={onRegistered}
      handleSubmit={handleSubmit}
    >
      <TextField
        id="yearOfExp"
        label="Years of experience"
        variant="outlined"
        placeholder="1"
        {...register('yearOfExp')}
      />
    </FormDialog>
  )
}

export default RaterRegistrationDialog;
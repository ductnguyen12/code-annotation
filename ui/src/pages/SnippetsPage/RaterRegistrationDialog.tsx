import { TextField } from "@mui/material"
import { FC, ReactElement } from "react"
import { useForm } from "react-hook-form"
import api from "../../api"
import { useAppDispatch } from "../../app/hooks"
import FormDialog from "../../components/FormDialog"
import { Rater } from "../../interfaces/rater.interface"
import { pushNotification } from "../../slices/notificationSlice"
import { defaultAPIErrorHandle } from "../../util/error-util"

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
  const dispatch = useAppDispatch();

  const onRaterRegistration = async (rater: Rater) => {
    try {
      const newRater = await api.registerAsRater(rater);
      dispatch(pushNotification({ message: 'Register as rater successfully', variant: 'success' }));
      return newRater;
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
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
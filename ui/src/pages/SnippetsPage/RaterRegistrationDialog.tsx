import { Box, TextField } from "@mui/material"
import React, { FC, ReactElement, RefObject } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import AppDialog from "../../components/AppDialog"
import { Rater } from "../../interfaces/rater.interface"

type RaterRegistrationDialogProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
  onCreate: (rater: Rater) => Promise<Rater>,
}

const RaterRegistrationDialog: FC<RaterRegistrationDialogProps> = ({
  open,
  setOpen,
  onCreate,
}): ReactElement => {
  let form: RefObject<HTMLFormElement> = React.createRef();
  const { register, handleSubmit } = useForm<Rater>();

  const handleConfirm = () => {
    if (form.current) {
      form.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      )
    }
  }

  const onSubmit: SubmitHandler<Rater> = (rater: Rater) => {
    onCreate(rater)
      .then(() => {
        setOpen(false);
      })
  }

  return (
    <AppDialog
      title="Register as rater"
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
          id="yearOfExp"
          label="Years of experience"
          variant="outlined"
          placeholder="1"
          {...register('yearOfExp')}
        />
      </Box>
    </AppDialog>
  )
}

export default RaterRegistrationDialog;
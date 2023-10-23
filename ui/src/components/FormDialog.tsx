import { Box } from "@mui/material"
import React, { ReactElement, ReactNode, RefObject } from "react"
import { FieldValues, UseFormHandleSubmit } from "react-hook-form"
import AppDialog from "./AppDialog"

const FormDialog = <T extends FieldValues>({
  title,
  open,
  setOpen,
  onSubmit,
  onSuccess,
  onClose,
  handleSubmit,
  children,
}: {
  title?: string,
  open: boolean,
  setOpen: (open: boolean) => void,
  onSubmit: (value: T) => Promise<T>,
  onSuccess?: (value: T) => void,
  onClose?: () => void,
  handleSubmit: UseFormHandleSubmit<T, undefined>,
  children: ReactNode,
}): ReactElement => {
  let form: RefObject<HTMLFormElement> = React.createRef();

  const handleConfirm = () => {
    if (form.current) {
      form.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      )
    }
  };

  const onSubmission = (value: T) => {
    onSubmit(value)
      .then(() => {
        setOpen(false);
        if (onSuccess)
          onSuccess(value);
      })
  };

  return (
    <AppDialog
      title={title ? title : ""}
      open={open}
      setOpen={setOpen}
      onClose={() => {
        if (onClose)
          onClose();
      }}
      onConfirm={handleConfirm}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmission)}
        ref={form}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          p: 2,
          gap: 2,
        }}
      >
        {children}
      </Box>
    </AppDialog>
  );
}

export default FormDialog;
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { ReactElement, useMemo } from "react"
import { useAppDispatch } from "../../../app/hooks"
import { useModelExecutions, useModels } from "../../../hooks/model"
import { PageParams } from "../../../interfaces/common.interface"
import { PredictionTarget } from "../../../interfaces/model.interface"
import { createModelExecutionAsync, setOpenDialog } from "../../../slices/modelExecutionSlice"
import ModelExecutionForm from "./ModelExecutionForm"
import ModelExecutionTable from "./ModelExecutionTable"

const ModelExecutionDialog = ({
  targetId,
  targetType,
}: {
  targetId: number,
  targetType: PredictionTarget,
}): ReactElement => {
  const {
    status: modelStatus,
    models,
  } = useModels();

  const defaultExecutionParams = useMemo(() => ({
    targetId,
    targetType,
    size: 10,
    page: 0,
  } as PageParams), [targetId, targetType])

  const {
    status: executionStatus,
    openDialog,
    executions,
  } = useModelExecutions(defaultExecutionParams);

  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setOpenDialog(false));
  }

  const handleSubmit = (data: {
    modelId: number,
  }) => {
    dispatch(createModelExecutionAsync({
      targetId,
      targetType,
      ...data,
    }));
  };

  const loading = useMemo(
    () => 'loading' === modelStatus || 'loading' === executionStatus,
    [modelStatus, executionStatus]
  );

  return (
    <Dialog
      maxWidth="lg"
      fullWidth={true}
      open={openDialog}
      onClose={handleClose}
    >
      <DialogTitle>Model Execution</DialogTitle>
      <DialogContent>
        <ModelExecutionForm
          models={models}
          loading={loading}
          onSubmit={handleSubmit}
        />
        <ModelExecutionTable
          executions={executions}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModelExecutionDialog;
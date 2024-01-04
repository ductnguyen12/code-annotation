import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import { ReactElement, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import FormDialog from "../../components/FormDialog"
import { ExecutionType, Model, OutputFormat } from "../../interfaces/model.interface"
import { createModelAsync, selectModelState, setOpenDialog, setSelected, updateModelAsync } from "../../slices/modelSlice"

const DEFAULT_EXECUTION_TYPE = Object.keys(ExecutionType)[0] as ExecutionType;
const DEFAULT_OUTPUT_FORMAT = Object.keys(OutputFormat)[0] as OutputFormat;

const ModelManagementDialog = (): ReactElement => {
  const { register, handleSubmit, setValue, reset } = useForm<Model>();
  const {
    openDialog,
    selected,
  } = useAppSelector(selectModelState);

  const [executionType, setExecutionType] = useState<ExecutionType>(DEFAULT_EXECUTION_TYPE);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selected) {
      (Object.keys(selected) as (keyof Model)[]).forEach(key => setValue(key, selected[key]));
    }
  }, [selected, setValue])

  const onSubmission = async (model: Model) => {
    if (!!selected) {
      dispatch(updateModelAsync({ modelId: selected.id as number, model }));
    } else {
      dispatch(createModelAsync(model));
    }
    return model;
  };

  const resetForm = () => {
    dispatch(setSelected(undefined));
    reset();
  }

  const title = useMemo(
    () => !!selected ? `Edit model ID ${selected.id}` : 'Create model',
    [selected]
  );

  return (
    <FormDialog<Model>
      title={title}
      open={openDialog}
      setOpen={(open: boolean) => dispatch(setOpenDialog(open))}
      onSubmit={onSubmission}
      onSuccess={resetForm}
      onClose={resetForm}
      handleSubmit={handleSubmit}
    >
      <TextField
        id="name"
        label="Name"
        variant="outlined"
        required
        {...register('name', { required: true })}
      />
      <TextField
        id="rating-scale"
        label="Rating Scale"
        type="number"
        variant="outlined"
        required
        defaultValue={5}
        {...register('ratingScale', { required: true, valueAsNumber: true })}
      />

      {/* ===== Execution type ===== */}
      <FormControl fullWidth>
        <InputLabel id="execution-type" size="small">Execution type</InputLabel>
        <Select
          labelId="execution-type"
          id="execution-type-select"
          label="Execution type"
          size="small"
          required
          defaultValue={DEFAULT_EXECUTION_TYPE}
          {...register('executionType', {
            required: true,
            onChange: e => setExecutionType(e.target.value as ExecutionType),
          })}
        >
          {Object.keys(ExecutionType).map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ===== Output format ===== */}
      <FormControl fullWidth>
        <InputLabel id="output-format" size="small">Output format</InputLabel>
        <Select
          labelId="output-format"
          id="output-format-select"
          label="Output format"
          size="small"
          required
          defaultValue={DEFAULT_OUTPUT_FORMAT}
          {...register('outputFormat', {
            required: true,
          })}
        >
          {Object.keys(OutputFormat).map(format => (
            <MenuItem key={format} value={format}>{format}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ===== JAR configuration ===== */}
      {ExecutionType.COMMAND_LINE === executionType && (
        <>
          <TextField
            id="jar-file-path"
            label="JAR file path"
            defaultValue="/mnt/models/RSE-181223/RSE.jar"
            variant="outlined"
            required
            {...register('config.jarFilePath', { required: true })}
          />
          <TextField
            id="model-path"
            label="Model file path"
            defaultValue="/mnt/models/RSE-181223/readability.classifier"
            variant="outlined"
            required
            {...register('config.modelPath', { required: true })}
          />
          <TextField
            id="metrics-classpath"
            label="Metrics classpath"
            defaultValue="it.unimol.readability.metric.runnable.ExtractMetrics"
            variant="outlined"
            {...register('config.metricClasspath')}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked {...register('config.requireModelCopy')} />}
            label="Requires copying the model to classpath"
          />
        </>
      )}
    </FormDialog>
  );
};

export default ModelManagementDialog;
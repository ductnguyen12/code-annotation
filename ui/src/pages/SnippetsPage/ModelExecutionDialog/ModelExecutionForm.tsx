import SendIcon from '@mui/icons-material/Send';
import LoadingButton from "@mui/lab/LoadingButton";
import Box from '@mui/material/Box';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SubmitHandler, useForm } from "react-hook-form";
import { Model } from "../../../interfaces/model.interface";

interface FormData {
  modelId: number;
}

const ModelExecutionForm = ({
  models,
  loading,
  onSubmit,
}: {
  models: Model[],
  loading?: boolean,
  onSubmit: (data: FormData) => void;
}) => {
  const { register, handleSubmit } = useForm<FormData>();

  const submitHandler: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mt: 1,
        mb: 1,
      }}
      component="form"
      onSubmit={handleSubmit(submitHandler)}
    >
      <FormControl fullWidth>
        <InputLabel id="model" size="small">Model</InputLabel>
        <Select
          labelId="model"
          id="model-select"
          label="Model"
          size="small"
          required
          defaultValue={models.length > 0 ? models[0].id || '' : ''}
          {...register('modelId', {
            required: true,
            valueAsNumber: true,
          })}
        >
          {models.map(model => (
            <MenuItem key={model.id} value={model.id}>{model.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <LoadingButton
        type="submit"
        loading={!!loading}
        endIcon={<SendIcon />}
        loadingPosition="end"
        variant="contained"
      >
        <span>Execute</span>
      </LoadingButton>
    </Box>
  )
}

export default ModelExecutionForm;
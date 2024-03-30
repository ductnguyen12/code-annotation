import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useFormContext } from "react-hook-form";
import { QuestionType } from "../../interfaces/question.interface";

export default function QuestionTypeSelector() {
  const { register, watch } = useFormContext();
  const questionType = watch<any>('type', QuestionType.SINGLE_CHOICE) as QuestionType;

  return (
    <FormControl fullWidth>
      <InputLabel id="question-type" size="small">Question type</InputLabel>
      <Select
        labelId="question-type"
        id="question-type-select"
        label="Question type"
        size="small"
        value={questionType}
        {...register('type', {
          required: true,
        })}
      >
        {Object.keys(QuestionType).map(type => (
          <MenuItem key={type} value={type}>{type}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
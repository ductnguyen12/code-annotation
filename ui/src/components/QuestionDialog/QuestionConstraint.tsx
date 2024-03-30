import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import { useFormContext } from "react-hook-form";

export default function QuestionConstraint() {
  const { register, watch } = useFormContext();
  const required = watch('constraint.required', false);
  const isNumber = watch('constraint.isNumber', false);

  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">Constraint</FormLabel>
      <FormGroup sx={{ display: 'flex', flexDirection: 'row', }}>
        <FormControlLabel
          control={
            <Checkbox checked={required || false} {...register('constraint.required')} />
          }
          label="Required"

        />
        <FormControlLabel
          control={
            <Checkbox checked={isNumber || false} {...register('constraint.isNumber')} />
          }
          label="Input is a number"
        />
      </FormGroup>
    </FormControl>
  );
}
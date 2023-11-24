import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormHelperText from "@mui/material/FormHelperText"
import FormLabel from "@mui/material/FormLabel"
import { useCallback, useEffect } from "react"
import { Question, Solution } from "../../interfaces/question.interface"

const MultipleChoice = ({
  questionIndex,
  question,
  solution,
  validity,
  showError,
  onInit,
  onFocus,
  onBlur,
  onValueChange,
}: {
  questionIndex: number,
  question: Question,
  solution?: Solution,
  validity?: boolean,
  showError?: boolean,
  onInit: (validity: boolean) => void,
  onFocus: () => void,
  onBlur: (validity: boolean) => void,
  onValueChange: (questionIndex: number, solution: Solution) => void,
}) => {
  const required = !!question.constraint?.required;
  const validate = useCallback(() => {
    return !required || (solution?.value?.selected?.length || 0) > 0;
  }, [required, solution]);

  useEffect(() => {
    const valid = validate();
    onInit(valid);
  }, [validate, onInit]);

  const handleBlur = () => {
    const valid = validate();
    onBlur(valid);
  }

  const handleChange = (checked: boolean, index: number) => {
    if (!solution) {
      solution = {
        questionId: question.id as number,
        value: { selected: [] },
      };
    }

    if (checked) {
      if (!solution.value.selected)
        solution.value.selected = [];

      solution.value.selected.push(index);
    } else {
      solution.value.selected = solution?.value.selected?.filter(value => value !== index);
    }

    onValueChange(questionIndex, solution);
  }

  return (
    <FormControl
      sx={{ m: 3 }}
      component="fieldset"
      variant="standard"
      error={showError && !validity}
    >
      <FormLabel component="legend"
        required={!!question.constraint?.required}
      >
        {`${questionIndex + 1}. ${question?.content}`}
      </FormLabel>
      <FormGroup
        onFocus={onFocus}
        onBlur={handleBlur}
      >
        {question?.answer?.options?.map((option, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={solution?.value.selected?.includes(index)}
                onChange={e => handleChange(e.target.checked, index)}
                name={index + ""}
              />
            }
            label={option}
          />
        ))}
      </FormGroup>
      <FormHelperText>This question is required</FormHelperText>
    </FormControl>
  )
}

export default MultipleChoice;
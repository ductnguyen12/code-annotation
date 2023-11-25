import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import { useCallback, useEffect } from "react"
import { Question, Solution } from "../../interfaces/question.interface"
import FormHelperText from "@mui/material/FormHelperText"

const InputQuestion = ({
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
    return !required || !!solution?.value.input;
  }, [required, solution]);

  useEffect(() => {
    const valid = validate();
    onInit(valid);
  }, [validate, onInit]);

  const handleBlur = () => {
    const valid = validate();
    onBlur(valid);
  }

  const handleChange = (value: string) => {
    if (!solution) {
      solution = {
        questionId: question.id as number,
        value: {},
      };
    }
    if (question.constraint?.isNumber)
      solution.value.input = parseInt(value);
    else
      solution.value.input = value;
    onValueChange(questionIndex, solution);
  }

  return (
    <FormControl
      error={showError && !validity}
    >
      <FormLabel
        id={`question-id-${question.id}`}
        required={required}
      >
        {`${questionIndex + 1}. ${question.content}`}
      </FormLabel>
      <TextField
        variant="outlined"
        size="small"
        value={solution?.value.input || ""}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event.target.value)}
        error={showError && !validity}
        onFocus={onFocus}
        onBlur={handleBlur}
      />
      <FormHelperText>{showError && !validity ? 'This question is required' : ''}</FormHelperText>
    </FormControl>
  )
}

export default InputQuestion;
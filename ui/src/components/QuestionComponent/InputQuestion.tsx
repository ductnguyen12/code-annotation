import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import DOMPurify from "dompurify"
import { useCallback, useEffect, useMemo } from "react"
import { Question, Solution } from "../../interfaces/question.interface"

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
  const required = useMemo(() => !!question.constraint?.required, [question]);
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
    const newValue = {
      ...(solution?.value || {}),
      input: question.constraint?.isNumber ? parseInt(value) : value,
    };

    onValueChange(questionIndex, {
      ...(solution || {}),
      questionId: question.id as number,
      value: newValue,
    } as Solution);
  }

  return (
    <FormControl
      error={showError && !validity}
    >
      <FormLabel
        id={`question-id-${question.id}`}
        required={required}
      >
        <div
          className="inline-block"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(`${questionIndex + 1}. ${question.content || ''}`)
          }}
        />
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
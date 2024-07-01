import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText"
import FormLabel from "@mui/material/FormLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import DOMPurify from "dompurify"
import { useCallback, useEffect, useMemo } from "react"
import { Question, Solution } from "../../interfaces/question.interface"

const SingleChoice = ({
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
  const value = solution?.value.selected && solution?.value.selected.length > 0
    ? solution?.value.selected[0]
    : -1;

  const required = useMemo(() => !!question.constraint?.required, [question]);
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

  const handleChange = (selected: number) => {
    if (selected >= (question.answer?.options?.length || 0))
      throw Error('Index out of bound: ' + selected + '/' + question.answer?.options?.length);

    if (!solution)
      solution = {
        questionId: question.id as number,
        value: {},
      };
    const newSolution = {
      ...solution,
      questionId: question.id as number,
      value: {
        ...solution.value,
        selected: [selected],
      }
    }
    onValueChange(questionIndex, newSolution);
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
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(`${questionIndex + 1}. ${question.content || ''}`)
          }}
        />
      </FormLabel>
      <RadioGroup
        aria-labelledby={`question-id-${question.id}`}
        name={`question-id-${question.id}`}
        value={value}
        onFocus={onFocus}
        onBlur={handleBlur}
        onChange={e => handleChange(parseInt(e.target.value))}
      >
        {question.answer?.options?.map((option, index) => (
          <FormControlLabel
            key={index}
            value={index}
            label={(
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(option)
                }}
              />
            )}
            control={<Radio />}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{showError && !validity ? 'This question is required' : ''}</FormHelperText>
    </FormControl>
  )
}

export default SingleChoice;
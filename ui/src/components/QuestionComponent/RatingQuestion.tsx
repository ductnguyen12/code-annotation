import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import { useCallback, useEffect } from "react";
import { Question, Solution } from "../../interfaces/question.interface";
import MultipleRating from "../MultipleRating";

const RatingQuestion = ({
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

  const handleChange = (selected: number, index: number) => {
    if (!solution) {
      solution = {
        questionId: question.id as number,
        value: { selected: question.answer?.attributes?.map(_ => -1) || [] },
      };
    }
    if (!solution.value.selected) {
      solution.value.selected = question.answer?.attributes?.map(_ => -1) || [];
    }
    solution.value.selected[index] = selected;

    onValueChange(questionIndex, solution);
  }

  return (
    <FormControl
      error={showError && !validity}
    >
      <FormLabel
        component="legend"
        required={!!question.constraint?.required}
      >
        {`${questionIndex + 1}.`}
      </FormLabel>
      <MultipleRating
        name={`question-id-${question.id}`}
        options={question.answer?.options || []}
        attributes={question.answer?.attributes || []}
        selected={solution?.value.selected || []}
        onFocus={onFocus}
        onBlur={handleBlur}
        onValueChange={handleChange}
      />
      <FormHelperText>{showError && !validity ? 'This question is required' : ''}</FormHelperText>
    </FormControl>
  )
}

export default RatingQuestion;
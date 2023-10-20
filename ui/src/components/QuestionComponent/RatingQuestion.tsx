import FormControl from "@mui/material/FormControl";
import { Question, Solution } from "../../interfaces/question.interface";
import MultipleRating from "../MultipleRating";
import FormLabel from "@mui/material/FormLabel";

const RatingQuestion = ({
  questionIndex,
  question,
  solution,
  onValueChange,
}: {
  questionIndex: number,
  question: Question,
  solution?: Solution,
  onValueChange: (questionIndex: number, solution: Solution) => void;
}) => {

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
    <FormControl>
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
        onValueChange={handleChange}
      />
    </FormControl>
  )
}

export default RatingQuestion;
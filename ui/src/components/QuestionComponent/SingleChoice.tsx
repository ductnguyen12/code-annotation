import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import { Question, Solution } from "../../interfaces/question.interface"

const SingleChoice = ({
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
  const value = solution?.value.selected && solution?.value.selected.length > 0
    ? solution?.value.selected[0]
    : 0;

  const handleChange = (selected: number) => {
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
    <FormControl>
      <FormLabel id={`question-id-${question.id}`}>{`${questionIndex + 1}. ${question.content}`}</FormLabel>
      <RadioGroup
        aria-labelledby={`question-id-${question.id}`}
        name={`question-id-${question.id}`}
        value={value}
        onChange={e => handleChange(parseInt(e.target.value))}
      >
        {question.answer?.options?.map((option, index) => (
          <FormControlLabel key={index} value={index} control={<Radio />} label={option} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

export default SingleChoice;
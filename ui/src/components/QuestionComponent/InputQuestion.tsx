import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import { Question, Solution } from "../../interfaces/question.interface"

const InputQuestion = ({
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

  const handleChange = (value: string) => {
    if (!solution) {
      solution = {
        questionId: question.id as number,
        value: {},
      };
    }
    solution.value.input = value;
    onValueChange(questionIndex, solution);
  }

  return (
    <FormControl>
      <FormLabel id={`question-id-${question.id}`}>{`${questionIndex + 1}. ${question.content}`}</FormLabel>
      <TextField
        variant="outlined"
        value={solution?.value.input}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event.target.value)}
      />
    </FormControl>
  )
}

export default InputQuestion;
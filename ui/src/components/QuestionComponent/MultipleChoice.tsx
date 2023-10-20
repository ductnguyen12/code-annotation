import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import { Question, Solution } from "../../interfaces/question.interface"

const MultipleChoice = ({
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
      variant="standard">
      <FormLabel component="legend"
        required={!!question.constraint?.required}
      >
        {`${questionIndex + 1}. ${question?.content}`}
      </FormLabel>
      <FormGroup>
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
    </FormControl>
  )
}

export default MultipleChoice;
import * as React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { Answer, Question } from '../../../../interfaces/snippet.interface';
import { Grid } from '@mui/material';

interface SnippetQuestionProps {
  index: number;
  question?: Question;
  onAnswerChange: (answerId: number, checked: boolean) => void;
}

const SnippetQuestion: React.FC<SnippetQuestionProps> = ({
  index,
  question,
  onAnswerChange,
}) => {
  const [localAnswers, setLocalAnswers] = React.useState<Array<Answer>>([]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setLocalAnswers([
      ...localAnswers.slice(0, index),
      {
        ...localAnswers[index],
        selected: event.target.checked,
      },
      ...localAnswers.slice(index + 1, localAnswers.length),
    ]);
    onAnswerChange(Number(localAnswers[index].id), event.target.checked);
  };

  React.useEffect(() => {
    setLocalAnswers(question && question.answers ? question.answers : []);
  }, [question])

  return (
    <Grid key={question?.id} item xs={6}>
      <FormControl
        sx={{ m: 3 }}
        component="fieldset"
        variant="standard">
        <FormLabel component="legend">{`${index}. ${question?.content}`}</FormLabel>
        <FormGroup>
          {localAnswers.map((answer, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox checked={answer.selected} onChange={e => handleChange(e, index)} name={answer.id + ""} />
              }
              label={answer.content}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Grid>
  );
}

export default SnippetQuestion;
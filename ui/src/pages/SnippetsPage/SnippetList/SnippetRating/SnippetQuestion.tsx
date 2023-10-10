import * as React from 'react';

import { Grid } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import { useAppDispatch } from '../../../../app/hooks';
import { Question } from '../../../../interfaces/snippet.interface';
import { updateCurrentRateByKey } from '../../../../slices/snippetsSlice';

interface SnippetQuestionProps {
  index: number;
  question?: Question;
  selectedAnswers?: Array<number>;
}

const SnippetQuestion: React.FC<SnippetQuestionProps> = ({
  index,
  question,
  selectedAnswers,
}) => {
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, answerId: number) => {
    const newSelected = event.target.checked
      ? [...(selectedAnswers || []), answerId]
      : selectedAnswers?.filter(aid => aid !== answerId) || [];
    dispatch(updateCurrentRateByKey({ key: 'choices', value: newSelected }))
  };

  return (
    <Grid key={question?.id} item xs={6}>
      <FormControl
        sx={{ m: 3 }}
        component="fieldset"
        variant="standard">
        <FormLabel component="legend">{`${index}. ${question?.content}`}</FormLabel>
        <FormGroup>
          {question?.answers?.map((answer, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedAnswers?.includes(answer.id as number)}
                  onChange={e => handleChange(e, answer.id as number)}
                  name={answer.id + ""}
                />
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
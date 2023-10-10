import * as React from 'react';

import StarIcon from '@mui/icons-material/Star';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from '../../../../app/hooks';
import { Question, SnippetRate } from '../../../../interfaces/snippet.interface';
import { updateCurrentRateByKey } from '../../../../slices/snippetsSlice';
import SnippetQuestion from './SnippetQuestion';

interface SnippetRatingProps {
  rate?: SnippetRate;
  questions?: Array<Question>;
}

interface Labels {
  [key: number]: string;
}

const labels: Labels = {
  1: 'Extremely bad',
  2: 'Bad',
  3: 'Ok',
  4: 'Good',
  5: 'Excellent',
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

const SnippetRating: React.FC<SnippetRatingProps> = ({
  rate,
  questions,
}) => {
  const dispatch = useAppDispatch();
  const [hover, setHover] = React.useState(-1);
  const {
    value: rateValue,
    comment,
    selectedAnswers,
  } = rate || {
    value: 0,
    comment: "",
    selectedAnswers: [],
  }

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <FormControl
        sx={{
          width: '300px',
        }}
      >
        <TextField
          id="comment"
          label="Comment"
          multiline
          fullWidth
          rows={3}
          value={comment}
          onChange={(event) => dispatch(updateCurrentRateByKey({ key: 'comment', value: event.target.value }))}
        />
      </FormControl>
      <FormControl>
        <Rating
          getLabelText={getLabelText}
          onChange={(event, newValue) => dispatch(updateCurrentRateByKey({ key: 'rate', value: newValue ? newValue : 0 }))}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          value={rateValue}
        />
        {rateValue && rateValue > 0 && (
          <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rateValue]}</Box>
        )}
      </FormControl>
      <Grid container sx={{ m: 1 }} spacing={2}>
        {questions?.map((q, index) => (
          <SnippetQuestion
            key={q.id}
            index={index + 1}
            question={q}
            selectedAnswers={selectedAnswers}
          />
        ))}
      </Grid>
    </Box>
  );
}

export default SnippetRating;
import * as React from 'react';

import StarIcon from '@mui/icons-material/Star';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from '../../../../app/hooks';
import { SnippetQuestion as SQuestion, SnippetRate } from '../../../../interfaces/snippet.interface';
import { updateCurrentRateByKey } from '../../../../slices/snippetsSlice';
import SnippetQuestion from './SnippetQuestion';

interface SnippetRatingProps {
  rate?: SnippetRate;
  questions?: Array<SQuestion>;
  editable?: boolean;
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
  editable,
}) => {
  const dispatch = useAppDispatch();
  const [hover, setHover] = React.useState(-1);
  const {
    value: rateValue,
    comment,
  } = rate || {
    value: 0,
    comment: "",
  }

  const handleChange = (key: string, value: any) => {
    if (!editable)
      return;
    dispatch(updateCurrentRateByKey({ key, value }));
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
          value={comment || ""}
          onChange={(event) => handleChange('comment', event.target.value)}
        />
      </FormControl>
      <FormControl>
        <Rating
          getLabelText={getLabelText}
          onChange={(event, newValue) => handleChange('rate', newValue ? newValue : 0)}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          value={rateValue}
        />
        {((!!rateValue && rateValue > 0) || hover !== -1) && (
          <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rateValue]}</Box>
        )}
      </FormControl>
      <Grid container sx={{ m: 1 }} spacing={2}>
        {questions?.map((q, index) => (
          <SnippetQuestion
            key={q.id}
            index={index}
            question={q}
            editable={editable}
          />
        ))}
      </Grid>
    </Box>
  );
}

export default SnippetRating;
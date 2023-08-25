import * as React from 'react';

import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import { LoadingButton } from '@mui/lab';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { useEffect } from 'react';
import { Question } from '../../interfaces/snippet.interface';
import CodeRatingQuestion from './CodeRatingQuestion';

interface CodeRatingProps {
  rate: number | undefined;
  comment: string | undefined;
  questions?: Array<Question>;
  onRateChange: (rate: number | undefined, comment: string | undefined, selectedAnswers: Set<number>) => void;
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

const CodeRating: React.FC<CodeRatingProps> = ({
  rate,
  comment,
  questions,
  onRateChange,
}) => {
  const [hover, setHover] = React.useState(-1);
  const [localRate, setLocalRate] = React.useState(0);
  const [localComment, setLocalComment] = React.useState("");
  const [selectedAnswers, setSelectedAnswers] = React.useState<Set<number>>(new Set());

  useEffect(() => {
    setLocalRate(rate ? rate : 0);
    setLocalComment(comment ? comment : "");
  }, [rate, comment])

  useEffect(() => {
    setSelectedAnswers(new Set(
      questions?.flatMap(q => q.answers || [])
        .filter(a => a.id && !!a.selected)
        .map(a => Number(a.id))
      || []
    ));
  }, [questions])

  const onAnswerChange = (answerId: number, checked: boolean) => {
    if (checked)
      selectedAnswers.add(answerId);
    else
      selectedAnswers.delete(answerId);
    setSelectedAnswers(selectedAnswers);
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
          value={localComment ? localComment : ""}
          onChange={(event) => setLocalComment(event.target.value)}
        />
      </FormControl>
      <FormControl>
        <Rating
          getLabelText={getLabelText}
          onChange={(event, newValue) => setLocalRate(newValue ? newValue : 0)}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          value={localRate ? localRate : 0}
        />
        {localRate > 0 && (
          <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : localRate]}</Box>
        )}
      </FormControl>
      <Grid container sx={{ m: 1 }} spacing={2}>
        {questions?.map((q, index) => (
          <CodeRatingQuestion
            key={q.id}
            index={index + 1}
            question={q}
            onAnswerChange={onAnswerChange}
          />
        ))}
      </Grid>
      <LoadingButton
        loading={false}
        endIcon={<SendIcon />}
        loadingPosition="end"
        variant="contained"
        onClick={() => onRateChange(localRate, localComment, selectedAnswers)}
      >
        <span>Submit</span>
      </LoadingButton>
    </Box>
  );
}

export default CodeRating;
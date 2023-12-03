import * as React from 'react';

import StarIcon from '@mui/icons-material/Star';
import { Grid, styled } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { useAppDispatch } from '../../../../app/hooks';
import ProtectedElement from '../../../../components/ProtectedElement';
import { SnippetQuestion as SQuestion, SnippetRate } from '../../../../interfaces/snippet.interface';
import { updateCurrentRateByKey } from '../../../../slices/snippetsSlice';
import SnippetQuestion from './SnippetQuestion';

interface SnippetRatingProps {
  rate?: SnippetRate;
  questions?: Array<SQuestion>;
  rater?: string;                 // For filtering soluton
  editable?: boolean;
  hideQuestions?: boolean;
  statistics?: {
    averageRating: number,
  };
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

const AverageRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#1976d2',
  },
});

const SnippetRating: React.FC<SnippetRatingProps> = ({
  rate,
  questions,
  rater,
  editable,
  hideQuestions,
  statistics,
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
        <Box
          hidden={!rateValue && hover === -1}
          sx={{
            ml: 2,
            minHeight: '24px',
            display: 'block',
          }}
        >
          {labels[hover !== -1 ? hover : rateValue]}
        </Box>
      </FormControl>
      <ProtectedElement hidden>
        <>
          <AverageRating
            readOnly
            precision={0.5}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            value={Math.floor((statistics?.averageRating || 0) * 4) / 4}
          />
          <Box>({statistics?.averageRating || 0.0} on average)</Box>
        </>
      </ProtectedElement>
      {!hideQuestions && (
        <Grid container sx={{ m: 1 }} spacing={2}>
          {questions?.map((q, index) => (
            <SnippetQuestion
              key={q.id}
              index={index}
              question={q}
              rater={rater}
              editable={editable}
            />
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default SnippetRating;
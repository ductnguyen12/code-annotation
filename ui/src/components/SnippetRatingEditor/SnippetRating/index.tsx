import * as React from 'react';

import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { PredictedRating } from '../../../interfaces/model.interface';
import { Solution } from '../../../interfaces/question.interface';
import { SnippetQuestion as SQuestion, SnippetRate } from '../../../interfaces/snippet.interface';
import ProtectedElement from '../../ProtectedElement';
import AddQuestionButton from './AddQuestionButton';
import MetricsDialog from './MetricsDialog';
import SnippetQuestion from './SnippetQuestion';

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

const CorrectRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#f73411',
  },
});

const AverageRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#1976d2',
  },
});

const PRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#19d24d',
  },
});

export default function SnippetRating({
  rating,
  questions,
  rater,
  invalid,
  editable,
  shouldHideQuestions,
  disableComment,
  correctRating,
  statistics,
  pRating,
  pRatingScale,
  onFocus,
  onBlur,
  onValueChange,
  onSolutionChange,
  onCreateQuestion,
  onDeleteQuestion,
}: {
  rating?: SnippetRate;
  questions?: Array<SQuestion>;
  rater?: string;                 // For filtering soluton
  invalid?: boolean;
  editable?: boolean;
  shouldHideQuestions?: boolean;
  disableComment?: boolean;
  correctRating?: number;
  statistics?: {
    averageRating: number;
  };
  pRating?: PredictedRating;
  pRatingScale?: number;
  onFocus?: () => void,
  onBlur?: () => void,
  onValueChange?: (key: string, value: any) => void;
  onSolutionChange?: (questionIndex: number, solution: Solution) => void;
  onCreateQuestion?: (question: SQuestion) => void;
  onDeleteQuestion?: (question: SQuestion) => void;
}) {
  const [hover, setHover] = React.useState(-1);
  const [openMetricsDialog, setOpenMetricsDialog] = React.useState(false);
  const {
    value: ratingValue,
    comment,
  } = rating || {
    value: 0,
    comment: "",
  }

  const handleChange = React.useCallback((key: string, value: any) => {
    if (!editable)
      return;
    if (onValueChange)
      onValueChange(key, value);
  }, [editable, onValueChange]);

  const pRatingValue = React.useMemo(
    () => {
      if (!pRating?.value || !pRatingScale)
        return undefined;
      return pRating.value / pRatingScale * 5;
    },
    [pRating, pRatingScale],
  );

  const handleDeleteQuestion = React.useCallback((questionIndex: number) => {
    if (questions && questionIndex < questions.length) {
      onDeleteQuestion && onDeleteQuestion(questions[questionIndex]);
    }
  }, [onDeleteQuestion, questions]);

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {!disableComment && (<FormControl
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
          error={invalid}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(event) => handleChange('comment', event.target.value)}
        />
      </FormControl>)}
      <FormControl error={invalid}>
        <Rating
          getLabelText={getLabelText}
          onChange={(event, newValue) => {
            onFocus && onFocus();
            handleChange('rate', newValue ? newValue : 0);
          }}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          value={ratingValue}
        />
        <Box
          hidden={!ratingValue && hover === -1}
          sx={{
            ml: 2,
            minHeight: '24px',
            display: 'block',
          }}
        >
          {labels[hover !== -1 ? hover : ratingValue]}
        </Box>
      </FormControl>
      {correctRating && (<ProtectedElement hidden>
        <>
          <CorrectRating
            readOnly
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            value={correctRating}
          />
          <Box>(Correct rating: {correctRating})</Box>
        </>
      </ProtectedElement>)}
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
      <ProtectedElement hidden>
        <>
          <PRating
            readOnly
            precision={0.5}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            value={Math.floor((pRatingValue || 0) * 4) / 4}
          />
          <Box>
            ({pRating?.value || 0.0} in prediction)
            <Tooltip title="Metrics">
              <IconButton onClick={() => setOpenMetricsDialog(true)}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <MetricsDialog
            metrics={pRating?.metrics}
            open={openMetricsDialog}
            onClose={() => setOpenMetricsDialog(false)}
          />
        </>
      </ProtectedElement>
      {!shouldHideQuestions && (
        <Grid
          className="justify-center mb-4"
          sx={{ minWidth: 600, mt: -2 }}
          rowSpacing={5}
          columnSpacing={3}
          container
        >
          {questions?.map((q, index) => (
            <SnippetQuestion
              key={q.id}
              index={index}
              question={q}
              rater={rater}
              invalid={invalid}
              editable={editable}
              onFocus={onFocus}
              onBlur={onBlur}
              onSolutionChange={onSolutionChange}
              onDelete={handleDeleteQuestion}
            />
          ))}
        </Grid>
      )}
      <ProtectedElement hidden>
        <AddQuestionButton
          onCreate={onCreateQuestion}
        />
      </ProtectedElement>
    </Box>
  );
}
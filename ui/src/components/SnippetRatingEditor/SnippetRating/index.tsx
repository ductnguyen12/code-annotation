import * as React from 'react';

import BlockIcon from '@mui/icons-material/Block';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { PredictedRating } from '../../../interfaces/model.interface';
import { SnippetRate } from '../../../interfaces/snippet.interface';
import ProtectedElement from '../../ProtectedElement';
import MetricsDialog from './MetricsDialog';

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
  invalid,
  editable,
  disableComment,
  allowNoRating,
  correctRating,
  statistics,
  pRating,
  pRatingScale,
  onFocus,
  onBlur,
  onValueChange,
}: {
  rating?: SnippetRate;
  invalid?: boolean;
  editable?: boolean;
  disableComment?: boolean;
  allowNoRating?: boolean;
  correctRating?: number;
  statistics?: {
    averageRating: number;
  };
  pRating?: PredictedRating;
  pRatingScale?: number;
  onFocus?: () => void,
  onBlur?: () => void,
  onValueChange?: (key: string, value: any) => void;
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

  const pRatingValue = React.useMemo(
    () => {
      if (!pRating?.value || !pRatingScale)
        return undefined;
      return pRating.value / pRatingScale * 5;
    },
    [pRating, pRatingScale],
  );

  const ignoreRating = React.useMemo(() => ratingValue === -1, [ratingValue]);

  const handleChange = React.useCallback((key: string, value: any) => {
    if (!editable)
      return;
    if (onValueChange)
      onValueChange(key, value);
  }, [editable, onValueChange]);

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
      {(!disableComment || ignoreRating) && (<FormControl
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
        <Box
          sx={{ display: "inline-flex" }}
        >
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
          {allowNoRating && (<Tooltip
            title="No rating. Please input the reason in comment box."
            placement="right-end"
            arrow
          >
            <Checkbox
              sx={{
                padding: '1px',
              }}
              checked={ignoreRating}
              icon={(<BlockIcon style={{ opacity: 0.55 }} />)}
              checkedIcon={<BlockIcon color="error" />}
              onChange={(_, checked) => {
                onFocus && onFocus();
                handleChange('rate', checked ? -1 : 0);
              }}
            />
          </Tooltip>)}
        </Box>
        <Box
          hidden={!ratingValue && !ignoreRating && hover === -1}
          sx={{
            ml: 2,
            minHeight: '24px',
            display: 'block',
          }}
        >
          {!ignoreRating ? labels[hover !== -1 ? hover : ratingValue] : 'No rating'}
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
    </Box>
  );
}
import * as React from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { QuestionType, Solution } from '../../../interfaces/question.interface';
import { SnippetQuestion as SQuestion } from '../../../interfaces/snippet.interface';
import ConfirmationDialog from '../../ConfirmationDialog';
import ProtectedElement from '../../ProtectedElement';
import QuestionComponent from '../../QuestionComponent';

export default function SnippetQuestion({
  index,
  question,
  rater,
  invalid,
  editable,
  onFocus,
  onBlur,
  onSolutionChange,
  onDelete,
}: {
  index: number;
  question: SQuestion;
  rater?: string;         // For filtering soluton
  invalid?: boolean;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSolutionChange?: (questionIndex: number, solution: Solution) => void;
  onDelete?: (questionIndex: number) => void;
}) {
  const [open, setOpen] = React.useState<boolean>(false);

  const handleChange = React.useCallback(
    (questionIndex: number, solution: Solution) => {
      if (!editable)
        return;
      if (onSolutionChange)
        onSolutionChange(questionIndex, solution);
    }, [editable, onSolutionChange]
  );

  const confirmContent = React.useMemo(() => {
    if (question.solutions?.length) {
      return 'Deleting will cascade deleting answers that were already given to this question';
    }
    return undefined;
  }, [question.solutions?.length]);

  const gridItemSize = React.useMemo(() => {
    switch (question.type) {
      case QuestionType.RATING:
        return 10;
      default:
        return 6;
    }
  }, [question.type]);

  return (
    <Grid
      key={question?.id}
      xs={gridItemSize}
      className="relative"
      item
    >
      {question?.hidden && (<ProtectedElement hidden>
        <Tooltip
          className="right-6 top-4 p-2"
          sx={{ position: 'absolute' }}
          title="Hidden at first"
          placement="bottom"
          arrow
        >
          <Box>
            <VisibilityOffIcon className="p-1" />
          </Box>
        </Tooltip>
      </ProtectedElement>)}
      {onDelete && (<ProtectedElement hidden>
        <>
          <Tooltip
            className="right-0 top-4"
            sx={{ position: 'absolute' }}
            title="Delete"
            placement="bottom"
            hidden={!onDelete}
            arrow
          >
            <IconButton
              aria-label="delete"
              hidden={!onDelete}
              onClick={() => setOpen(true)}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <ConfirmationDialog
            title="Are you sure to delete this question?"
            confirmColor={confirmContent ? 'error' : 'primary'}
            content={confirmContent}
            open={open}
            setOpen={setOpen}
            onConfirm={() => onDelete(index)}
          />
        </>
      </ProtectedElement>)}
      <QuestionComponent
        questionIndex={index}
        question={question}
        solution={editable
          ? question.solution
          : question.solutions?.find(s => s.raterId === rater)
        }
        invalid={invalid}
        showError={!!invalid}
        onFocus={onFocus}
        onBlur={onBlur}
        onValueChange={handleChange}
      />
    </Grid>
  );
}
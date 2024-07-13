import * as React from 'react';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Solution } from '../../../interfaces/question.interface';
import { SnippetQuestion as SQuestion } from '../../../interfaces/snippet.interface';
import { formatMilliseconds } from '../../../util/time-util';
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

  const solution = React.useMemo(() => editable
    ? question.solution
    : question.solutions?.find(s => s.raterId === rater),
    [editable, question.solution, question.solutions, rater]
  );

  const confirmContent = React.useMemo(() => {
    if (question.solutions?.length) {
      return 'Deleting will cascade deleting answers that were already given to this question';
    }
    return undefined;
  }, [question.solutions?.length]);

  return (
    <Box
      className="relative"
    >
      {question?.hidden && (<ProtectedElement hidden>
        <Tooltip
          className="right-6 bottom-0 z-10 p-2"
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
            className="right-0 bottom-0 z-10"
            sx={{ position: 'absolute' }}
            title={`Delete question ${index + 1}`}
            placement="bottom"
            hidden={!onDelete}
            arrow
          >
            <IconButton
              aria-label="delete"
              hidden={!onDelete}
              onClick={() => setOpen(true)}
            >
              <DeleteOutlineIcon color="error" />
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
        solution={solution}
        invalid={invalid}
        showError={!!invalid}
        onFocus={onFocus}
        onBlur={onBlur}
        onValueChange={handleChange}
      />
      {solution?.timeTaken && (<ProtectedElement hidden>
        <Typography variant="caption" display="block" gutterBottom>
          Time taken: {formatMilliseconds(solution.timeTaken)}
        </Typography>
      </ProtectedElement>)}
    </Box>
  );
}
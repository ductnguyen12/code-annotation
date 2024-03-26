import * as React from 'react';

import { Grid } from '@mui/material';
import { QuestionType, Solution } from '../../../interfaces/question.interface';
import { SnippetQuestion as SQuestion } from '../../../interfaces/snippet.interface';
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
}: {
  index: number;
  question: SQuestion;
  rater?: string;         // For filtering soluton
  invalid?: boolean;
  editable?: boolean;
  onFocus?: () => void,
  onBlur?: () => void,
  onSolutionChange?: (questionIndex: number, solution: Solution) => void;
}) {
  const handleChange = React.useCallback(
    (questionIndex: number, solution: Solution) => {
      if (!editable)
        return;
      if (onSolutionChange)
        onSolutionChange(questionIndex, solution);
    }, [editable, onSolutionChange]
  );

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
      item
    >
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
import * as React from 'react';

import { Grid } from '@mui/material';
import { Solution } from '../../../interfaces/question.interface';
import { SnippetQuestion as SQuestion } from '../../../interfaces/snippet.interface';
import QuestionComponent from '../../QuestionComponent';

export default function SnippetQuestion({
  index,
  question,
  rater,
  editable,
  onSolutionChange,
}: {
  index: number;
  question: SQuestion;
  rater?: string;         // For filtering soluton
  editable?: boolean;
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

  return (
    <Grid key={question?.id} item xs={6}>
      <QuestionComponent
        questionIndex={index}
        question={question}
        solution={editable
          ? question.solution
          : question.solutions?.find(s => s.raterId === rater)
        }
        onValueChange={handleChange}
      />
    </Grid>
  );
}
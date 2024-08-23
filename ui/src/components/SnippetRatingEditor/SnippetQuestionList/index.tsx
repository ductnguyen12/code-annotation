import * as React from 'react';

import Grid from '@mui/material/Grid';
import { QuestionType, Solution } from '../../../interfaces/question.interface';
import { SnippetQuestion as SQuestion } from '../../../interfaces/snippet.interface';
import SnippetQuestion from './SnippetQuestion';


export default function SnippetQuestionList({
  questions,
  rater,
  invalid,
  editable,
  shouldHideQuestions,
  columns,
  onFocus,
  onBlur,
  onSolutionChange,
  onDeleteQuestion,
  onHiddenChange,
}: {
  questions?: Array<SQuestion>;
  rater?: string;                 // For filtering soluton
  invalid?: boolean;
  editable?: boolean;
  shouldHideQuestions?: boolean;
  columns?: number;               // Number of columns
  onFocus?: () => void,
  onBlur?: () => void,
  onSolutionChange?: (questionIndex: number, solution: Solution) => void;
  onDeleteQuestion?: (question: SQuestion) => void;
  onHiddenChange?: (question: SQuestion) => void;
}) {
  const numberOfColumns = React.useMemo(() => columns || 1, [columns]);

  const handleSolutionChange = React.useCallback((questionId: number, solution: Solution) => {
    const questionIndex = questions?.findIndex(q => q.id === questionId);
    if (questionIndex !== undefined && questionIndex >= 0) {
      onSolutionChange && onSolutionChange(questionIndex, solution);
    }
  }, [onSolutionChange, questions]);

  const handleQuestionEvent = React.useCallback((
    questionIndex: number,
    handle?: (question: SQuestion) => void
  ) => {
    if (questions && questionIndex < questions.length) {
      handle && handle(questions[questionIndex]);
    }
  }, [questions]);

  const handleDeleteQuestion = React.useCallback((questionIndex: number) => {
    handleQuestionEvent(questionIndex, onDeleteQuestion);
  }, [handleQuestionEvent, onDeleteQuestion]);

  const handleHiddenChange = React.useCallback((questionIndex: number) => {
    handleQuestionEvent(questionIndex, onHiddenChange);
  }, [handleQuestionEvent, onHiddenChange]);

  return (
    <Grid
      rowSpacing={5}
      columnSpacing={3}
      container
    >
      {questions?.filter((q: SQuestion) => !q.hidden || !shouldHideQuestions)
        .map((q: SQuestion, index: number) => (
          <Grid
            key={q?.id}
            xs={q?.type === QuestionType.RATING ? 12 : 12 / numberOfColumns}
            item
          >
            <SnippetQuestion
              key={q.id}
              index={index}
              question={q}
              rater={rater}
              invalid={invalid}
              editable={editable}
              onFocus={onFocus}
              onBlur={onBlur}
              onSolutionChange={(_, s) => handleSolutionChange(q.id as number, s)}
              onDelete={handleDeleteQuestion}
              onHiddenChange={handleHiddenChange}
            />
          </Grid>
        ))}
    </Grid>
  );
}
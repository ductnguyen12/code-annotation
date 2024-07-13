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
}) {
  const questionIndexMap = React.useMemo(() => {
    if (!questions)
      return {};
    const map = Object.fromEntries(questions.map((q, index) => [q.id as number, index]));
    return map;
  }, [questions]);

  const numberOfColumns = React.useMemo(() => columns || 1, [columns]);

  const handleSolutionChange = React.useCallback((questionId: number, solution: Solution) => {
    if (!onSolutionChange)
      return;
    onSolutionChange(questionIndexMap[questionId], solution);
  }, [onSolutionChange, questionIndexMap]);

  const handleDeleteQuestion = React.useCallback((questionIndex: number) => {
    if (questions && questionIndex < questions.length) {
      onDeleteQuestion && onDeleteQuestion(questions[questionIndex]);
    }
  }, [onDeleteQuestion, questions]);

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
              onSolutionChange={(_: number, solution: Solution) => handleSolutionChange(q.id as number, solution)}
              onDelete={handleDeleteQuestion}
            />
          </Grid>
        ))}
    </Grid>
  );
}
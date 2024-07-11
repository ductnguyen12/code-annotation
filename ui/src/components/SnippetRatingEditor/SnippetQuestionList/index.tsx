import * as React from 'react';

import Grid from '@mui/material/Grid';
import { QuestionPriority, Solution } from '../../../interfaces/question.interface';
import { SnippetQuestion as SQuestion } from '../../../interfaces/snippet.interface';
import ProtectedElement from '../../ProtectedElement';
import AddQuestionButton from './AddQuestionButton';
import ReorderQuestionButton from './ReorderQuestionButton';
import SnippetQuestion from './SnippetQuestion';


export default function SnippetQuestionList({
  questions,
  rater,
  invalid,
  editable,
  shouldHideQuestions,
  onFocus,
  onBlur,
  onSolutionChange,
  onCreateQuestion,
  onDeleteQuestion,
  onQuestionPriorityChange,
}: {
  questions?: Array<SQuestion>;
  rater?: string;                 // For filtering soluton
  invalid?: boolean;
  editable?: boolean;
  shouldHideQuestions?: boolean;
  onFocus?: () => void,
  onBlur?: () => void,
  onSolutionChange?: (questionIndex: number, solution: Solution) => void;
  onCreateQuestion?: (question: SQuestion) => void;
  onDeleteQuestion?: (question: SQuestion) => void;
  onQuestionPriorityChange?: (priorities: QuestionPriority) => void;
}) {
  const questionIndexMap = React.useMemo(() => {
    if (!questions)
      return {};
    const map = Object.fromEntries(questions.map((q, index) => [q.id as number, index]));
    return map;
  }, [questions]);

  const sortedQuestions = React.useMemo(() => {
    return questions?.slice().sort((q1, q2) => {
      if ((!q1.priority && q1.priority !== 0) || (!q2.priority && q2.priority !== 0)) {
        return (q1.id as number) - (q2.id as number);
      }
      return (q1.priority as number) - (q2.priority as number);
    }) || [];
  }, [questions]);

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
      className="justify-center mb-4"
      sx={{ minWidth: 600, mt: -2 }}
      rowSpacing={5}
      columnSpacing={3}
      container
    >
      {sortedQuestions
        .filter(q => !q.hidden || !shouldHideQuestions)
        .map((q, index) => (
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
        ))}
      <ProtectedElement hidden>
        <Grid
          className="flex gap-x-2"
          xs={12}
          item
        >
          <AddQuestionButton
            onCreate={onCreateQuestion}
          />
          <ReorderQuestionButton
            questions={sortedQuestions}
            onChange={onQuestionPriorityChange}
          />
        </Grid>
      </ProtectedElement>
    </Grid>
  );
}
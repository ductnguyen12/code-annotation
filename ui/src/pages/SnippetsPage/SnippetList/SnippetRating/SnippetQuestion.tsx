import * as React from 'react';

import { Grid } from '@mui/material';
import { useAppDispatch } from '../../../../app/hooks';
import QuestionComponent from '../../../../components/QuestionComponent';
import { Solution } from '../../../../interfaces/question.interface';
import { SnippetQuestion as SQuestion } from '../../../../interfaces/snippet.interface';
import { updateQuestionSolution } from '../../../../slices/snippetsSlice';

interface SnippetQuestionProps {
  index: number;
  question: SQuestion;
  rater?: string;         // For filtering soluton
  editable?: boolean;
}

const SnippetQuestion: React.FC<SnippetQuestionProps> = ({
  index,
  question,
  rater,
  editable,
}) => {
  const dispatch = useAppDispatch();

  const handleChange = (questionIndex: number, solution: Solution) => {
    if (!editable)
      return;
    dispatch(updateQuestionSolution({ questionIndex, solution }));
  };

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

export default SnippetQuestion;
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
}

const SnippetQuestion: React.FC<SnippetQuestionProps> = ({
  index,
  question,
}) => {
  const dispatch = useAppDispatch();

  const handleChange = (questionIndex: number, solution: Solution) => {
    dispatch(updateQuestionSolution({ questionIndex, solution }));
  };

  return (
    <Grid key={question?.id} item xs={6}>
      <QuestionComponent
        questionIndex={index}
        question={question}
        solution={question.solution}
        onValueChange={handleChange}
      />
    </Grid>
  );
}

export default SnippetQuestion;
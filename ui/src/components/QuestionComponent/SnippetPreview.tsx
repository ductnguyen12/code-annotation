import { useCallback, useEffect, useMemo } from "react";
import { DemographicQuestion, Question, Solution } from "../../interfaces/question.interface";
import { Snippet, SnippetRate } from "../../interfaces/snippet.interface";
import SnippetRatingEditor from "../SnippetRatingEditor";

export default function SnippetPreview({
  questionIndex,
  question,
  solution,
  validity,
  showError,
  hideComment,
  allowNoRating,
  onInit,
  onFocus,
  onBlur,
  onValueChange,
}: {
  questionIndex: number,
  question: Question,
  solution?: Solution,
  validity?: boolean,
  showError?: boolean,
  hideComment?: boolean,
  allowNoRating?: boolean,
  onInit: (validity: boolean) => void,
  onFocus: () => void,
  onBlur: (validity: boolean) => void,
  onValueChange: (questionIndex: number, solution: Solution, subQuestionIndex?: number) => void,
}) {
  const demographicQuestion = useMemo(() => question as DemographicQuestion, [question]);

  const snippets = useMemo(() => {
    const _snippet = JSON.parse(demographicQuestion.content as string) as Snippet;
    // Update snippet rate using information from solution
    if (solution?.value?.selected || solution?.value?.input) {
      _snippet.rate = {
        value: solution?.value?.selected ? solution.value.selected[0] : 0,
        comment: solution?.value?.input ? solution?.value?.input as string : undefined,
      }
    }

    // Update snippet question solution using information from solution of sub-questions
    _snippet.questions = demographicQuestion.subQuestions?.map(q => ({ ...q, snippetId: _snippet.id }));

    return [_snippet];
  }, [demographicQuestion, solution]);

  const defaultPLanguage = useMemo(
    () => snippets && snippets.length > 0 ? snippets[0].pLanguage : undefined,
    [snippets]
  );

  const required = useMemo(() => !!question.constraint?.required, [question]);

  const validate = useCallback(() => {
    const selected = demographicQuestion.solution?.value.selected;
    const ratingValue = selected?.length === 1 ? selected[0] : undefined;
    const comment = demographicQuestion.solution?.value.input;

    // No rating without giving comment
    if (ratingValue === -1 && !comment)
      return false;

    // Not a required question
    if (!required)
      return true;

    // Not give a rating
    if (!ratingValue)
      return false;

    // Must answer all snippet questions
    const subQuestionsConstraint =
      (demographicQuestion.subQuestions || []).length === (demographicQuestion.subQuestions || [])
        .filter(q => (q.solution?.value.selected || [])?.length > 0
          || (q.solution?.value.input as string)?.length > 0)
        .length;

    return subQuestionsConstraint;
  }, [required, demographicQuestion]);

  useEffect(() => {
    const valid = validate();
    onInit(valid);
  }, [validate, onInit]);

  const handleBlur = () => {
    const valid = validate();
    onBlur(valid);
  }

  const handleRatingUpdate = useCallback((key: string, value: any): void => {
    let currentSolution = solution;
    if (!currentSolution)
      currentSolution = {
        questionId: question.id as number,
        value: {},
      };
    const solutionValue = "rate" === key
      ? {
        ...currentSolution.value,
        selected: [value as number],
      }
      : {
        ...currentSolution.value,
        input: value as string,
      }
    const newSolution = {
      ...currentSolution,
      value: solutionValue,
    } as Solution;

    onValueChange(questionIndex, newSolution);
  }, [questionIndex, question.id, solution, onValueChange]);

  const handleSolutionChange = useCallback((subQuestionIndex: number, subSolution: Solution) => {
    onValueChange(questionIndex, subSolution, subQuestionIndex);
  }, [questionIndex, onValueChange]);

  return (
    <SnippetRatingEditor
      snippets={snippets}
      selected={0}
      defaultPLanguage={defaultPLanguage}
      invalid={showError && !validity}
      editable
      disableLanguageSelector={true}
      disablePagination
      disableNavigation
      disableSubmission
      disableComment={hideComment}
      allowNoRating={allowNoRating}
      onFocus={onFocus}
      onBlur={handleBlur}
      onSnippetChange={(index: number) => { }}
      onRatingUpdate={handleRatingUpdate}
      onRatingSubmit={(rating: SnippetRate, next?: number) => { }}
      onSolutionChange={handleSolutionChange}
    />
  )
}
import { useCallback, useMemo, useState } from "react"
import { Question, QuestionType, Solution } from "../../interfaces/question.interface"
import InputQuestion from "./InputQuestion"
import MultipleChoice from "./MultipleChoice"
import RatingQuestion from "./RatingQuestion"
import SingleChoice from "./SingleChoice"
import SnippetPreview from "./SnippetPreview"
import TextOnly from "./TextOnly"

const getQuestionComponents = (questionType: QuestionType) => {
  switch (questionType) {
    case QuestionType.TEXT_ONLY:
      return TextOnly;
    case QuestionType.SINGLE_CHOICE:
      return SingleChoice;
    case QuestionType.MULTIPLE_CHOICE:
      return MultipleChoice;
    case QuestionType.RATING:
      return RatingQuestion;
    case QuestionType.INPUT:
      return InputQuestion;
    case QuestionType.SNIPPET:
      return SnippetPreview;
  }
}

const QuestionComponent = ({
  questionIndex,
  question,
  solution,
  invalid,
  showError,
  setShowError,
  onFocus,
  onBlur,
  onValueChange,
  onValidityChange,
}: {
  questionIndex: number;
  question: Question;
  solution?: Solution;
  invalid?: boolean;    // Force invalid from outside
  showError?: boolean;
  setShowError?: (value: boolean) => void;
  onFocus?: () => void,
  onBlur?: () => void,
  onValueChange: (questionIndex: number, solution: Solution, subQuestionIndex?: number) => void;
  onValidityChange?: (questionIndex: number, validity: boolean) => void;
}) => {
  const [validity, setValidity] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const renderTime = useMemo(() => Date.now(), [question]);

  const notifyValidityChange = useCallback((valid: boolean) => {
    if (onValidityChange)
      onValidityChange(questionIndex, valid);
  }, [questionIndex, onValidityChange]);

  const handleInit = useCallback((valid: boolean) => {
    setValidity(valid);
    notifyValidityChange(valid);
  }, [notifyValidityChange]);

  const handleFocus = useCallback(() => {
    if (onFocus)
      onFocus();
    if (showError && setShowError) {
      setShowError(false);
    }
  }, [onFocus, setShowError, showError]);

  const handleBlur = useCallback((valid: boolean) => {
    if (onBlur)
      onBlur();
    if (setShowError)
      setShowError(true);
    if (valid !== validity) {
      setValidity(valid);
      notifyValidityChange(valid);
    }
  }, [notifyValidityChange, onBlur, setShowError, validity]);

  const handleValueChange = useCallback((questionIndex: number, solution: Solution, subQuestionIndex?: number) => {
    const elapsedTime = Date.now() - renderTime;
    solution.timeTaken = (solution.timeTaken || 0) + elapsedTime;
    onValueChange(questionIndex, solution, subQuestionIndex);
  }, [onValueChange, renderTime]);

  const Component = useMemo(() => getQuestionComponents(question.type), [question]);

  return (
    <Component
      questionIndex={questionIndex}
      question={question}
      solution={solution}
      validity={validity && !invalid}
      showError={showError}
      onInit={handleInit}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onValueChange={handleValueChange}
    />
  )
}

export default QuestionComponent;
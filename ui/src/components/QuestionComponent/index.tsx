import { useState } from "react"
import { Question, QuestionType, Solution } from "../../interfaces/question.interface"
import InputQuestion from "./InputQuestion"
import MultipleChoice from "./MultipleChoice"
import RatingQuestion from "./RatingQuestion"
import SingleChoice from "./SingleChoice"

const getQuestionComponents = (questionType: QuestionType) => {
  switch (questionType) {
    case QuestionType.SINGLE_CHOICE:
      return SingleChoice;
    case QuestionType.MULTIPLE_CHOICE:
      return MultipleChoice;
    case QuestionType.RATING:
      return RatingQuestion;
    case QuestionType.INPUT:
      return InputQuestion;
  }
}

const QuestionComponent = ({
  questionIndex,
  question,
  solution,
  showError,
  setShowError,
  onValueChange,
  onValidityChange,
}: {
  questionIndex: number;
  question: Question;
  solution?: Solution;
  showError?: boolean;
  setShowError?: (value: boolean) => void;
  onValueChange: (questionIndex: number, solution: Solution) => void;
  onValidityChange?: (questionIndex: number, validity: boolean) => void;
}) => {
  const [validity, setValidity] = useState(true);

  const notifyValidityChange = (valid: boolean) => {
    if (onValidityChange)
      onValidityChange(questionIndex, valid);
  }

  const handleInit = (valid: boolean) => {
    setValidity(valid);
    notifyValidityChange(valid);
  }

  const handleFocus = () => {
    if (showError && setShowError) {
      setShowError(false);
    }
  }

  const handleBlur = (valid: boolean) => {
    if (setShowError)
      setShowError(true);
    if (valid !== validity) {
      setValidity(valid);
      notifyValidityChange(valid);
    }
  }

  const Component = getQuestionComponents(question.type);
  return (
    <Component
      questionIndex={questionIndex}
      question={question}
      solution={solution}
      validity={validity}
      showError={showError}
      onInit={handleInit}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onValueChange={onValueChange}
    />
  )
}

export default QuestionComponent;
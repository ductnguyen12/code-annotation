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
  onValueChange,
}: {
  questionIndex: number;
  question: Question;
  solution?: Solution;
  onValueChange: (questionIndex: number, solution: Solution) => void;
}) => {
  const Component = getQuestionComponents(question.type);
  return (
    <Component
      questionIndex={questionIndex}
      question={question}
      solution={solution}
      onValueChange={onValueChange}
    />
  )
}

export default QuestionComponent;
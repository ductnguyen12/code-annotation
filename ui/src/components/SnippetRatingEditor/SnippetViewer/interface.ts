import { DatasetStatistics } from "../../../interfaces/dataset.interface";
import { Model, PredictedRating } from "../../../interfaces/model.interface";
import { QuestionPriority, Solution } from "../../../interfaces/question.interface";
import { Snippet, SnippetQuestion } from "../../../interfaces/snippet.interface";

export interface SnippetViewerProps {
  layout?: 'vertical' | 'horizontal',
  snippet?: Snippet;
  questions?: SnippetQuestion[],
  selectedRater?: string;
  defaultPLanguage?: string;
  statistics?: DatasetStatistics;
  pRatings?: PredictedRating[];
  invalid?: boolean;
  models?: Model[];
  editable?: boolean;
  showSnippetPath?: boolean;
  disableLanguageSelector?: boolean;
  shouldHideQuestions?: boolean;
  disableComment?: boolean;
  allowNoRating?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onRatingUpdate: (key: string, value: any) => void;
  onSolutionChange: (questionIndex: number, solution: Solution) => void;
  onCreateQuestion?: (question: SnippetQuestion) => void;
  onDeleteQuestion?: (question: SnippetQuestion) => void;
  onQuestionHiddenChange?: (question: SnippetQuestion) => void;
  onQuestionPriorityChange?: (priorities: QuestionPriority) => void;
}
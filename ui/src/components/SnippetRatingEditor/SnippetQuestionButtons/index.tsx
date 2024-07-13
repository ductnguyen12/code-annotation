import Grid from "@mui/material/Grid";
import { QuestionPriority } from "../../../interfaces/question.interface";
import { SnippetQuestion } from "../../../interfaces/snippet.interface";
import ProtectedElement from "../../ProtectedElement";
import AddQuestionButton from "./AddQuestionButton";
import ReorderQuestionButton from "./ReorderQuestionButton";

export default function SnippetQuestionButtons({
  questions,
  onCreateQuestion,
  onQuestionPriorityChange,
}: {
  questions?: SnippetQuestion[];
  onCreateQuestion?: (question: SnippetQuestion) => void;
  onQuestionPriorityChange?: (priorities: QuestionPriority) => void;
}) {
  return (
    <ProtectedElement hidden>
      <Grid
        columnSpacing={1}
        container
      >
        <Grid
          xs={6}
          item
        >
          <AddQuestionButton
            onCreate={onCreateQuestion}
          />
        </Grid>
        <Grid
          xs={6}
          item
        >
          <ReorderQuestionButton
            questions={questions}
            onChange={onQuestionPriorityChange}
          />
        </Grid>
      </Grid>
    </ProtectedElement>
  )
}
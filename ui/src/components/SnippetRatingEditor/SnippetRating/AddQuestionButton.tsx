import Button from "@mui/material/Button";
import { useCallback, useState } from "react";
import { QuestionType } from "../../../interfaces/question.interface";
import { SnippetQuestion } from "../../../interfaces/snippet.interface";
import QuestionDialog from "../../QuestionDialog";

const SUPPORT_QUESTION_TYPES = Object.keys(QuestionType)
  .map(type => type as QuestionType)
  .filter(type => ![QuestionType.TEXT_ONLY, QuestionType.SNIPPET].includes(type));

export default function AddQuestionButton({
  onCreate,
}: {
  onCreate?: (newQuestion: SnippetQuestion) => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSubmit = useCallback((newQuestion: SnippetQuestion) => {
    onCreate && onCreate(newQuestion);
  }, [onCreate]);

  return (
    <>
      <Button
        sx={{ minWidth: 600 }}
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Add question
      </Button>
      <QuestionDialog
        questionTypes={SUPPORT_QUESTION_TYPES}
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
}
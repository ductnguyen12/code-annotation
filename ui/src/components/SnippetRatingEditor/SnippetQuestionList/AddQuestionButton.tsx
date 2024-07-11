import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { QuestionType } from "../../../interfaces/question.interface";
import { SnippetQuestion } from "../../../interfaces/snippet.interface";
import QuestionDialog from "../../QuestionDialog";

const SUPPORT_QUESTION_TYPES = Object.keys(QuestionType)
  .map(type => type as QuestionType)
  .filter(type => ![QuestionType.TEXT_ONLY, QuestionType.SNIPPET].includes(type));

function SnippetQuestionOptions() {
  const { register } = useFormContext();

  return (
    <React.Fragment>
      <FormControlLabel
        control={
          <Checkbox {...register('hidden', { value: false })} />
        }
        label="Hide question at first"
      />
    </React.Fragment>
  )
}

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
        sx={{ flex: "1 1 0" }}
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
        children={[
          <SnippetQuestionOptions key="question-options" />
        ]}
      />
    </>
  );
}
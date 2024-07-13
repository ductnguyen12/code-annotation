import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { QuestionPriority } from "../../../interfaces/question.interface";
import { SnippetQuestion } from "../../../interfaces/snippet.interface";
import FormDialog from "../../FormDialog";
import QuestionPriorityFormControl from "../../QuestionPriorityFormControl";


export default function ReorderQuestionButton({
  questions,
  onChange,
}: {
  questions?: SnippetQuestion[];
  onChange?: (prioritiesMap: QuestionPriority) => void;
}) {
  const methods = useForm<QuestionPriority>();
  const { handleSubmit, reset } = methods;

  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const onSubmit = useCallback(async (prioritiesMap: QuestionPriority) => {
    onChange && onChange(prioritiesMap);
    return prioritiesMap;
  }, [onChange]);

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => setOpen(true)}
      >
        Reorder questions
      </Button>
      <FormDialog<QuestionPriority>
        title="Reorder questions"
        open={open}
        onSubmit={onSubmit}
        onClose={handleClose}
        handleSubmit={handleSubmit}
      >
        <FormProvider {...methods}>
          {questions?.length ? (
            <QuestionPriorityFormControl
              questions={questions}
            />
          ) : <Typography variant="body1">There is no question</Typography>}
        </FormProvider>
      </FormDialog>
    </>
  );
}
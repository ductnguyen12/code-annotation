import { useCallback, useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormDialog from "../../components/FormDialog";
import { Dataset } from '../../interfaces/dataset.interface';
import { Question, QuestionType } from "../../interfaces/question.interface";
import { Snippet } from '../../interfaces/snippet.interface';
import WYSIWYGEditor from "../WYSIWYGEditor";
import QuestionConstraint from './QuestionConstraint';
import QuestionOptions from './QuestionOptions';
import QuestionTypeSelector from './QuestionTypeSelector';
import SnippetSelectorContainer from "./SnippetSelectorContainer";

const DEFAULT_FORM_VALUES = {
  content: '',
  type: QuestionType.SINGLE_CHOICE,
  answer: {
    options: [],
    attributes: [],
  },
};
export default function QuestionDialog<T extends Question>({
  open,
  question,
  datasets,
  snippets,
  questionTypes,
  children,
  onClose,
  onSubmit,
  onDatasetChange,
}: {
  open: boolean,
  question?: T,
  datasets?: Dataset[],
  snippets?: Snippet[],
  questionTypes?: QuestionType[],
  children?: JSX.Element[],
  onClose?: () => void,
  onSubmit?: (question: T) => void,
  onDatasetChange?: (dataset: Dataset) => void,
}) {
  const methods = useForm<any>();

  const { watch, handleSubmit, reset, control } = methods;

  const questionType = watch<any>('type') as QuestionType;

  useEffect(() => {
    if (!question) {
      reset(DEFAULT_FORM_VALUES);
    } else {
      reset({
        ...question,
        answer: !question.answer ? undefined : {
          options: question.answer.options?.map((value, i) => ({
            value,
            correct: question.answer?.correctChoices?.includes(i),
            isInput: question.answer?.inputPositions?.includes(i),
          })),
          attributes: question.answer.attributes?.map((value, i) => ({
            value,
          })),
        }
      });
    }
  }, [question, reset]);

  const handleSubmission = async (newQuestion: any) => {
    if (newQuestion.answer) {
      newQuestion.answer = {
        ...newQuestion.answer,
        options: newQuestion.answer.options?.map((option: any) => option.value),
        attributes: newQuestion.answer.attributes?.map((option: any) => option.value),
        correctChoices: newQuestion.answer.options?.map(((option: any, i: number) => [option, i]))
          .filter((pair: any[]) => pair[0].correct)
          .map((pair: any[]) => pair[1] as number),
        inputPositions: newQuestion.answer.options?.map((option: any, i: number) => [option, i])
          .filter((pair: any[]) => pair[0].isInput)
          .map((pair: any[]) => pair[1] as number),
      }
    }

    onSubmit && onSubmit(newQuestion as T);

    return newQuestion;
  };

  const handleClose = useCallback(() => {
    reset(DEFAULT_FORM_VALUES);
    onClose && onClose();
  }, [onClose, reset])

  const title = useMemo(
    () => !!question ? `Edit Question ID ${question.id}` : "Create Question",
    [question],
  );

  return (
    <FormDialog<T>
      title={title}
      open={open}
      onSubmit={handleSubmission}
      onClose={handleClose}
      handleSubmit={handleSubmit}
    >
      <FormProvider {...methods}>
        {QuestionType.SNIPPET !== questionType && (<Controller
          render={({ field: { value, onChange, onBlur } }) => (
            <WYSIWYGEditor
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Content"
            />
          )}
          control={control}
          name="content"
        />)}

        {/* ===== Snippet selector ===== */}
        {QuestionType.SNIPPET === questionType && (
          <SnippetSelectorContainer
            content={question?.content}
            datasets={!datasets ? [] : datasets as Dataset[]}
            snippets={!snippets ? [] : snippets as Snippet[]}
            onDatasetChange={onDatasetChange}
          />
        )}

        {/* ===== Question type ===== */}
        <QuestionTypeSelector questionTypes={questionTypes} />

        {/* ===== Constraint ===== */}
        {QuestionType.TEXT_ONLY !== questionType && (
          <QuestionConstraint />
        )}

        {/* ===== Options ===== */}
        {[
          QuestionType.SINGLE_CHOICE,
          QuestionType.MULTIPLE_CHOICE,
          QuestionType.RATING,
        ].includes(questionType) && (
            <QuestionOptions
              label="Options"
              valuePath="answer.options"
              subOptions={[{
                label: 'Correct',
                path: 'correct',
              }, {
                label: 'Is input',
                path: 'isInput',
              }]}
            />
          )}

        {/* ===== Attributes ===== */}
        {QuestionType.RATING === questionType && (
          <QuestionOptions
            label="Attributes"
            valuePath="answer.attributes"
          />
        )}

        {/* ===== Other components ===== */}
        {children}
      </FormProvider>
    </FormDialog>
  );
};
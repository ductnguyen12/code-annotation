import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { DatasetStatistics } from '../../interfaces/dataset.interface';
import { Model, PredictedRating } from '../../interfaces/model.interface';
import { Solution } from '../../interfaces/question.interface';
import { Snippet, SnippetQuestion, SnippetRate } from "../../interfaces/snippet.interface";
import { pushNotification } from '../../slices/notificationSlice';
import SnippetViewer from '../SnippetViewer';
import NavigationButton from './NavigationButton';
import SnippetRating from "./SnippetRating";

export default function SnippetRatingEditor({
  snippets,
  selected,
  selectedRater,
  defaultPLanguage,
  statistics,
  pRatings,
  models,
  invalid,
  editable,
  shouldHideQuestions,
  showSnippetPath,
  disableLanguageSelector,
  disablePagination,
  disableNavigation,
  disableSubmission,
  disableComment,
  onFocus,
  onBlur,
  onSnippetChange,
  onRatingUpdate,
  onRatingSubmit,
  onSolutionChange,
  onCreateQuestion,
  onDeleteQuestion,
}: {
  snippets: Snippet[];
  selected: number;
  selectedRater?: string;
  defaultPLanguage?: string;
  statistics?: DatasetStatistics;
  pRatings?: PredictedRating[];
  models?: Model[];
  invalid?: boolean;
  editable?: boolean;
  shouldHideQuestions?: boolean;
  showSnippetPath?: boolean;
  disableLanguageSelector?: boolean;
  disablePagination?: boolean;
  disableNavigation?: boolean;
  disableSubmission?: boolean;
  disableComment?: boolean;
  onFocus?: () => void,
  onBlur?: () => void,
  onSnippetChange: (index: number) => void;
  onRatingUpdate: (key: string, value: any) => void;
  onRatingSubmit: (rating: SnippetRate, next?: number) => void;
  onSolutionChange: (questionIndex: number, solution: Solution) => void;
  onCreateQuestion?: (question: SnippetQuestion) => void;
  onDeleteQuestion?: (question: SnippetQuestion) => void;
}) {
  const dispatch = useAppDispatch();

  const [hiddenQuestion, setHiddenQuestion] = useState(false);

  const showQuestions = useMemo(
    () => !shouldHideQuestions || !hiddenQuestion
      || (snippets[selected] && (snippets[selected].questions?.length || 0) < 1),
    [selected, snippets, shouldHideQuestions, hiddenQuestion]
  );

  const handleRatingSubmit = useCallback(
    (nextSnippet?: number): void => {
      if (!editable)
        return;
      if (snippets[selected].rate?.value === undefined
        || (snippets[selected].rate?.value as number) < 1) {
        dispatch(pushNotification({
          message: 'Rating is required',
          variant: 'error',
        }));
        return;
      }
      if (!showQuestions) {
        setHiddenQuestion(false);
        return;
      }
      const solutions = snippets[selected].questions?.map(q => q.solution)
        .filter(s => s) as Array<Solution>;
      const rate: SnippetRate = {
        ...snippets[selected].rate as SnippetRate,
        solutions: solutions,
        isSubmission: nextSnippet === undefined,   // Hit submit button
      };
      onRatingSubmit(rate, nextSnippet);
    },
    [
      snippets, selected, editable, showQuestions,
      setHiddenQuestion, dispatch, onRatingSubmit,
    ]
  );

  const handleSnippetChange = useCallback((index: number) => {
    if (!editable) {
      onSnippetChange(index);
    } else {
      handleRatingSubmit(index);
    }
  }, [editable, onSnippetChange, handleRatingSubmit]);

  const handleCreateQuestion = useCallback((question: SnippetQuestion) => {
    if (snippets && selected < snippets.length) {
      question.snippetId = snippets[selected].id;
      onCreateQuestion && onCreateQuestion(question);
    }
  }, [onCreateQuestion, selected, snippets]);

  useEffect(() => {
    // set hidden questions to default value.
    setHiddenQuestion(!!shouldHideQuestions);
  }, [shouldHideQuestions]);

  return snippets.length <= selected
    ? (<Typography variant="body2">There is no snippet in this dataset</Typography>)
    : (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {!disablePagination && (<Pagination
          count={snippets.length}
          page={selected ? selected + 1 : 1}
          onChange={(event, page: number) => !editable && handleSnippetChange(page - 1)}
          className={editable ? 'pointer-events-none' : undefined}
          hideNextButton
          hidePrevButton
        />)}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {!disableNavigation && selected > 0 ? (
            <NavigationButton
              title="Previous snippet"
              placement="right-end"
              icon={<ArrowBackIcon fontSize="large" />}
              onClick={() => handleSnippetChange(selected - 1)}
            />
          ) : <div />}
          {!disableNavigation && (selected < snippets.length - 1 || !showQuestions) && (
            <NavigationButton
              title="Next snippet"
              placement="left-end"
              icon={<ArrowForwardIcon fontSize="large" />}
              onClick={() => handleSnippetChange(selected + 1)}
            />
          )}
        </Box>
        <SnippetViewer
          snippet={snippets[selected]}
          defaultPLanguage={defaultPLanguage}
          showSnippetPath={showSnippetPath}
          disableLanguageSelector={disableLanguageSelector}
        />
        <SnippetRating
          rating={
            // Edit my rating or view other's rating
            editable
              ? snippets[selected].rate
              : snippets[selected].rates?.find(r => selectedRater === r.rater?.id)
          }
          questions={snippets[selected].questions}
          rater={selectedRater}
          invalid={invalid}
          editable={editable}
          shouldHideQuestions={!showQuestions}
          disableComment={disableComment}
          correctRating={snippets[selected].correctRating}
          statistics={statistics?.snippets[snippets[selected].id]}
          pRating={pRatings?.find(rating => rating.snippetId === snippets[selected].id)}
          pRatingScale={models?.find(model => {
            const pRating = pRatings?.find(rating => rating.snippetId === snippets[selected].id);
            return pRating && model.id === pRating.modelId;
          })?.ratingScale}
          onFocus={onFocus}
          onBlur={onBlur}
          onValueChange={onRatingUpdate}
          onSolutionChange={onSolutionChange}
          onCreateQuestion={handleCreateQuestion}
          onDeleteQuestion={onDeleteQuestion}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {!disableNavigation && selected > 0 ? (
            <NavigationButton
              title="Previous snippet"
              placement="right-end"
              icon={<ArrowBackIcon fontSize="large" />}
              onClick={() => handleSnippetChange(selected - 1)}
            />
          ) : <div />}
          {!disableNavigation && (selected < snippets.length - 1 || !showQuestions) && (
            <NavigationButton
              title="Next snippet"
              placement="left-end"
              icon={<ArrowForwardIcon fontSize="large" />}
              onClick={() => handleSnippetChange(selected + 1)}
            />
          )}
          {selected === snippets.length - 1
            && !disableSubmission
            && editable
            && showQuestions
            && (
              <LoadingButton
                loading={false}
                endIcon={<SendIcon />}
                loadingPosition="end"
                variant="contained"
                onClick={() => handleRatingSubmit()}
              >
                <span>Submit</span>
              </LoadingButton>
            )}
        </Box>
      </Box>
    );
}
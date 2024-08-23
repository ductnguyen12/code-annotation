import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from "@mui/material/Box";
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { DatasetStatistics } from '../../interfaces/dataset.interface';
import { Model, PredictedRating } from '../../interfaces/model.interface';
import { QuestionPriority, Solution } from '../../interfaces/question.interface';
import { Snippet, SnippetQuestion, SnippetRate } from "../../interfaces/snippet.interface";
import { pushNotification } from '../../slices/notificationSlice';
import LayoutSwitch from '../LayoutSwitch';
import NavigationButton from './NavigationButton';
import SnippetViewer from './SnippetViewer';

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
  allowNoRating,
  onFocus,
  onBlur,
  onSnippetChange,
  onRatingUpdate,
  onRatingSubmit,
  onSolutionChange,
  onCreateQuestion,
  onDeleteQuestion,
  onQuestionHiddenChange,
  onQuestionPriorityChange,
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
  allowNoRating?: boolean;
  onFocus?: () => void,
  onBlur?: () => void,
  onSnippetChange: (index: number) => void;
  onRatingUpdate: (key: string, value: any) => void;
  onRatingSubmit: (rating: SnippetRate, next?: number) => void;
  onSolutionChange: (questionIndex: number, solution: Solution) => void;
  onCreateQuestion?: (question: SnippetQuestion) => void;
  onDeleteQuestion?: (question: SnippetQuestion) => void;
  onQuestionHiddenChange?: (question: SnippetQuestion) => void;
  onQuestionPriorityChange?: (priorities: QuestionPriority) => void;
}) {
  const dispatch = useAppDispatch();

  const [hiddenQuestion, setHiddenQuestion] = useState(false);
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('vertical');

  const showQuestions = useMemo(
    () => !shouldHideQuestions
      || !hiddenQuestion                                          // Show in the second step
      || (snippets[selected] && (
        (snippets[selected].questions?.length || 0) < 1           // No questions
        || snippets[selected].questions?.every(q => !q.hidden)    // No hidden question
      )),
    [selected, snippets, shouldHideQuestions, hiddenQuestion]
  );

  const handleRatingSubmit = useCallback(
    (nextSnippet?: number): void => {
      if (!editable)
        return;
      const ratingValue = snippets[selected].rate?.value;
      if (ratingValue === undefined || ratingValue === 0) {
        dispatch(pushNotification({
          message: 'Rating is required',
          variant: 'error',
        }));
        return;
      } else if (ratingValue === -1 && !snippets[selected].rate?.comment) {
        // Ignore rating without give a comment
        dispatch(pushNotification({
          message: 'Comment is required when rating was ignored',
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
  }, [shouldHideQuestions, selected]);

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
        <Typography align="center" variant="body2" marginBottom={2}>
          {showSnippetPath ? snippets[selected].path : ''}
        </Typography>
        <Box className="self-start ml-6 mb-2">
          <FormControlLabel
            control={<LayoutSwitch sx={{ m: 1 }} />}
            label={layout === 'vertical' ? 'Vertical layout' : 'Horizontal layout'}
            onChange={(_, checked) => setLayout(checked ? 'horizontal' : 'vertical')}
          />
        </Box>
        <SnippetViewer
          layout={layout}
          snippet={snippets[selected]}
          selectedRater={selectedRater}
          defaultPLanguage={defaultPLanguage}
          statistics={statistics}
          pRatings={pRatings}
          invalid={invalid}
          models={models}
          editable={editable}
          showSnippetPath={showSnippetPath}
          disableLanguageSelector={disableLanguageSelector}
          shouldHideQuestions={!showQuestions}
          disableComment={disableComment}
          allowNoRating={allowNoRating}
          onFocus={onFocus}
          onBlur={onBlur}
          onRatingUpdate={onRatingUpdate}
          onSolutionChange={onSolutionChange}
          onCreateQuestion={handleCreateQuestion}
          onDeleteQuestion={onDeleteQuestion}
          onQuestionHiddenChange={onQuestionHiddenChange}
          onQuestionPriorityChange={onQuestionPriorityChange}
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
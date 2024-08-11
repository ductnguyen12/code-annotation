import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../../../api";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DatasetDetail from '../../../components/DatasetDetail';
import LoadingBackdrop from '../../../components/LoadingBackdrop';
import ProtectedElement from '../../../components/ProtectedElement';
import SnippetRatingEditor from '../../../components/SnippetRatingEditor';
import { useIdFromPath } from '../../../hooks/common';
import { useDataset, useDatasetPRatings, useDatasetStatistics } from '../../../hooks/dataset';
import { useModels } from '../../../hooks/model';
import { useDatasetSnippets } from "../../../hooks/snippet";
import { PredictionTarget } from '../../../interfaces/model.interface';
import { QuestionPriority, Solution } from "../../../interfaces/question.interface";
import { RaterActionType } from "../../../interfaces/rater.interface";
import { SnippetQuestion, SnippetRate } from "../../../interfaces/snippet.interface";
import { selectAuthState } from '../../../slices/authSlice';
import { selectRaterRegState } from "../../../slices/raterRegSlice";
import { createRaterActionAsync } from "../../../slices/raterSlice";
import {
  chooseSnippet,
  createQuestionAsync,
  deleteQuestionAsync,
  loadDatasetSnippetsAsync,
  rateSnippetAsync,
  reorderQuestionsAsync,
  updateCurrentRateByKey,
  updateQuestionSolution,
} from "../../../slices/snippetsSlice";
import ModelExecutionDialog from '../ModelExecutionDialog';
import SnippetToolBox from './SnippetToolBox';

const SnippetList = () => {
  const datasetId = useIdFromPath();
  const dataset = useDataset(datasetId);

  const {
    status,
    snippets,
    selected,
    selectedRater,
  } = useDatasetSnippets(datasetId);

  const {
    rater,
  } = useAppSelector(selectRaterRegState);

  const {
    models,
  } = useModels();

  const statistics = useDatasetStatistics(datasetId);

  const pRatings = useDatasetPRatings(datasetId || -1);

  const {
    authenticated,
  } = useAppSelector(selectAuthState);

  const editable = useMemo(() => !authenticated, [authenticated]);
  const shouldHideQuestions = useMemo(() => !authenticated
    && !!dataset?.configuration?.hiddenQuestions?.value,
    [authenticated, dataset]
  )

  const isRater = useMemo(() => !authenticated && rater?.id, [authenticated, rater?.id]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const createRaterAction = useCallback((action: RaterActionType, data?: any) => {
    dispatch(createRaterActionAsync({
      action,
      datasetId: datasetId as number,
      data,
    }));
  }, [datasetId, dispatch]);

  const handleSelectSnippet = useCallback((index: number) => {
    dispatch(chooseSnippet(index));
  }, [dispatch]);

  const handleRatingValueUpdate = useCallback(
    (key: string, value: any) => {
      dispatch(updateCurrentRateByKey({ key, value }));
      if ('rate' === key) {
        if (value < 1) {
          createRaterAction(RaterActionType.SET_NO_RATING, {
            value: -1 === value,
            snippetId: snippets[selected].id,
          });
        } else {
          createRaterAction(RaterActionType.SET_RATING, {
            value,
            snippetId: snippets[selected].id,
          });
        }
      }
    },
    [createRaterAction, dispatch, selected, snippets]
  );

  const handleRatingChange = useCallback((
    rating: SnippetRate,
    nextSnippet?: number,
    successfulMsg?: string,
  ): void => {
    dispatch(rateSnippetAsync({
      snippetId: snippets[selected].id,
      rate: rating,
      nextSnippet,
      successfulMsg,
      onSuccess: () => {
        if (nextSnippet !== undefined) {
          createRaterAction(RaterActionType.CHANGE_SNIPPET, {
            index: nextSnippet,
            snippetId: snippets[nextSnippet].id,
          });
          return;
        }

        createRaterAction(RaterActionType.SUBMIT);
        if (dataset?.configuration?.prolific)
          api.completeRatingInProlific(dataset?.id as number);
        else
          navigate(`/datasets/${dataset?.id as number}/survey-complete`);
      },
    }));
  }, [dispatch, snippets, selected, createRaterAction, dataset?.configuration?.prolific, dataset?.id, navigate]);

  const handleSolutionChange = (questionIndex: number, solution: Solution) => {
    dispatch(updateQuestionSolution({ questionIndex, solution }));
    createRaterAction(RaterActionType.SET_QUESTION_SOLUTION, {
      questionId: solution.questionId,
      value: solution.value,
    });
  }

  const handleCreateQuestion = useCallback((question: SnippetQuestion) => {
    dispatch(createQuestionAsync({ question, datasetId }));
  }, [datasetId, dispatch]);

  const handleDeleteQuestion = useCallback((question: SnippetQuestion) => {
    dispatch(deleteQuestionAsync({ questionId: question.id as number, datasetId }));
  }, [datasetId, dispatch]);

  const handleQuestionPriorityChange = useCallback((priority: QuestionPriority) => {
    dispatch(reorderQuestionsAsync({
      priority,
      onSuccess: () => dispatch(loadDatasetSnippetsAsync(datasetId as number)),
    }));
  }, [datasetId, dispatch]);

  useEffect(() => {
    if (!isRater)
      return;
    createRaterAction(RaterActionType.ENTER_RATING_PAGE);
  }, [createRaterAction, isRater]);

  return (
    <Box>
      <LoadingBackdrop open={'loading' === status} />
      {dataset && (<DatasetDetail dataset={dataset} />)}
      <ProtectedElement hidden={true}>
        <Button
          component={RouterLink}
          to={`/datasets/${datasetId}/overview`}
          sx={{
            mb: 3,
          }}
        >
          Detail
        </Button>
      </ProtectedElement>
      <Typography sx={{ mb: 2 }} variant="h5">
        Snippets
        <span><SnippetToolBox /></span>
      </Typography>

      {datasetId && (
        <ProtectedElement hidden={true}>
          <ModelExecutionDialog
            targetId={datasetId}
            targetType={PredictionTarget.DATASET}
          />
        </ProtectedElement>
      )}

      <SnippetRatingEditor
        snippets={snippets}
        selected={selected}
        selectedRater={selectedRater?.id}
        defaultPLanguage={dataset?.pLanguage}
        statistics={statistics}
        pRatings={pRatings}
        models={models}
        editable={editable}
        shouldHideQuestions={shouldHideQuestions}
        showSnippetPath={authenticated}
        disableLanguageSelector={!authenticated}
        disableComment={dataset?.configuration?.hideComment?.value}
        allowNoRating={dataset?.configuration?.allowNoRating?.value}
        onSnippetChange={handleSelectSnippet}
        onRatingUpdate={handleRatingValueUpdate}
        onRatingSubmit={(rating: SnippetRate, next?: number) => handleRatingChange(
          rating, next,
          'Submit rating successfully',
        )}
        onSolutionChange={handleSolutionChange}
        onCreateQuestion={handleCreateQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onQuestionPriorityChange={handleQuestionPriorityChange}
      />
    </Box>
  )
}

export default SnippetList;
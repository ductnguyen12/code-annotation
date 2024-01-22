import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback, useMemo } from 'react';
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
import { Solution } from "../../../interfaces/question.interface";
import { SnippetRate } from "../../../interfaces/snippet.interface";
import { selectAuthState } from '../../../slices/authSlice';
import { chooseSnippet, rateSnippetAsync, updateCurrentRateByKey, updateQuestionSolution } from "../../../slices/snippetsSlice";
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

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSelectSnippet = useCallback((index: number) => {
    dispatch(chooseSnippet(index));
  }, [dispatch]);

  const handleRatingValueUpdate = useCallback(
    (key: string, value: any) => {
      dispatch(updateCurrentRateByKey({ key, value }));
    },
    [dispatch]
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
        if (nextSnippet)
          return;
        if (dataset?.configuration?.prolificId)
          api.completeRatingInProlific(dataset?.id as number);
        else
          navigate(`/datasets/${dataset?.id as number}/survey-complete`);
      },
    }));
  }, [dispatch, snippets, selected, dataset, navigate]);

  const handleSolutionChange = (questionIndex: number, solution: Solution) => {
    dispatch(updateQuestionSolution({ questionIndex, solution }));
  }

  return (
    <Box>
      <LoadingBackdrop open={'loading' === status} />
      {dataset && (<DatasetDetail dataset={dataset} />)}
      <Button
        component={RouterLink}
        to={`/datasets/${datasetId}/overview`}
        sx={{
          mb: 3,
        }}
      >
        Detail
      </Button>
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
        selectedRater={selectedRater}
        statistics={statistics}
        pRatings={pRatings}
        models={models}
        editable={editable}
        shouldHideQuestions={shouldHideQuestions}
        disableComment={dataset?.configuration?.hideComment}
        onSnippetChange={handleSelectSnippet}
        onRatingUpdate={handleRatingValueUpdate}
        onRatingSubmit={(rating: SnippetRate, next?: number) => handleRatingChange(
          rating, next,
          'Submit rating successfully',
        )}
        onSolutionChange={handleSolutionChange}
      />
    </Box>
  )
}

export default SnippetList;
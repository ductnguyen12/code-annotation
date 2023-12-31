import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';
import { Button, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from 'react';
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import DatasetDetail from '../../../components/DatasetDetail';
import LoadingBackdrop from '../../../components/LoadingBackdrop';
import { useIdFromPath } from '../../../hooks/common';
import { useDataset, useDatasetPRatings, useDatasetStatistics } from '../../../hooks/dataset';
import { useModels } from '../../../hooks/model';
import { useDatasetSnippets } from "../../../hooks/snippet";
import { PredictionTarget } from '../../../interfaces/model.interface';
import { Solution } from '../../../interfaces/question.interface';
import { SnippetRate } from "../../../interfaces/snippet.interface";
import { selectAuthState } from '../../../slices/authSlice';
import { pushNotification } from '../../../slices/notificationSlice';
import { chooseSnippet, rateSnippetAsync } from "../../../slices/snippetsSlice";
import ModelExecutionDialog from '../ModelExecutionDialog';
import SnippetCode from './SnippetCode';
import SnippetRating from "./SnippetRating";
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

  const [hideQuestion, setHideQuestion] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Align to configuration in dataset everytime selected snippet has been changed 
    setHideQuestion(!authenticated && !!dataset?.configuration?.hiddenQuestions?.value);
  }, [authenticated, selected, dataset?.configuration?.hiddenQuestions?.value]);

  const onSelectSnippet = (index: number) => {
    if (!isEditable()) {
      dispatch(chooseSnippet(index));
    } else {
      onRateChange(index);
    }
  }

  const onRateChange = (nextSnippet?: number, successfulMsg?: string, completeDatasetId?: number): void => {
    if (!isEditable())
      return;
    if (snippets[selected].rate === undefined
      || (snippets[selected].rate?.value as number) < 1) {
      dispatch(pushNotification({
        message: 'Rating is required',
        variant: 'error',
      }));
      return;
    }
    if (shouldHideQuestions()) {
      setHideQuestion(false);
      return;
    }
    const solutions = snippets[selected].questions?.map(q => q.solution).filter(s => s) as Array<Solution>;
    const rate: SnippetRate = {
      ...snippets[selected].rate as SnippetRate,
      solutions: solutions,
    };
    dispatch(rateSnippetAsync({
      snippetId: snippets[selected].id,
      rate,
      nextSnippet,
      successfulMsg,
      completeDatasetId,
    }));
  }

  const isEditable = () => !authenticated;

  const shouldHideQuestions = () => !authenticated
    && hideQuestion
    && !!dataset?.configuration?.hiddenQuestions?.value
    && (snippets[selected].questions?.length || 0) > 0;

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
        <ModelExecutionDialog
          targetId={datasetId}
          targetType={PredictionTarget.DATASET}
        />
      )}

      {snippets.length > 0
        ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Pagination
              count={snippets.length}
              page={selected ? selected + 1 : 1}
              onChange={(event, page: number) => onSelectSnippet(page - 1)}
              hideNextButton
              hidePrevButton
            />
            <SnippetCode />
            <SnippetRating
              rate={
                // Edit my rating or view other's rating
                isEditable()
                  ? snippets[selected].rate
                  : snippets[selected].rates?.find(r => selectedRater === r.rater?.id)
              }
              questions={snippets[selected].questions}
              rater={selectedRater}
              editable={isEditable()}
              hideQuestions={shouldHideQuestions()}
              statistics={statistics?.snippets[snippets[selected].id]}
              pRating={pRatings.find(rating => rating.snippetId === snippets[selected].id)}
              pRatingScale={models.find(model => {
                const pRating = pRatings.find(rating => rating.snippetId === snippets[selected].id);
                return pRating && model.id === pRating.modelId;
              })?.ratingScale}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '90%',
              }}
            >
              {selected > 0 ? (
                <IconButton aria-label="Back" onClick={() => onSelectSnippet(selected - 1)}>
                  <ArrowBackIcon fontSize="large" />
                </IconButton>
              ) : <div />}
              {(selected < snippets.length - 1 || shouldHideQuestions()) && (
                <IconButton aria-label="Next" size="large" onClick={() => onSelectSnippet(selected + 1)}>
                  <ArrowForwardIcon fontSize="large" />
                </IconButton>
              )}
              {selected === snippets.length - 1
                && isEditable()
                && !shouldHideQuestions()
                && (
                  <LoadingButton
                    loading={false}
                    endIcon={<SendIcon />}
                    loadingPosition="end"
                    variant="contained"
                    onClick={() => onRateChange(
                      undefined,
                      'Submit ratings successfully!',
                      dataset?.configuration?.prolific ? dataset.id : undefined,
                    )}
                  >
                    <span>Submit</span>
                  </LoadingButton>
                )}
            </Box>
          </Box>
        )
        : (<Typography variant="body2">There is no snippet in this dataset</Typography>)}
    </Box>
  )
}

export default SnippetList;
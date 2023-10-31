import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import LoadingBackdrop from '../../../components/LoadingBackdrop';
import { useDatasetSnippets } from "../../../hooks/snippet";
import { Solution } from '../../../interfaces/question.interface';
import { SnippetRate } from "../../../interfaces/snippet.interface";
import { pushNotification } from '../../../slices/notificationSlice';
import { chooseSnippet, rateSnippetAsync } from "../../../slices/snippetsSlice";
import DatasetDetail from './DatasetDetail';
import SnippetCode from './SnippetCode';
import SnippetRating from "./SnippetRating";
import SnippetToolBox from './SnippetToolBox';

type RouteParams = {
  id: string,
}

const SnippetList = () => {
  const { id } = useParams<RouteParams>();
  const {
    status,
    snippets,
    selected,
    selectedRater,
  } = useDatasetSnippets(id ? parseInt(id) : undefined);
  const dispatch = useAppDispatch();

  const onSelectSnippet = (index: number) => {
    if (!isEditable()) {
      dispatch(chooseSnippet(index));
    } else {
      onRateChange(index);
    }
  }

  const onRateChange = (nextSnippet?: number, successfulMsg?: string): void => {
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
    }));
  }

  const isEditable = () => !selectedRater;

  return (
    <Box>
      <LoadingBackdrop open={'loading' === status} />
      <DatasetDetail />
      <Typography sx={{ mb: 2 }} variant="h5">
        Snippets
        <span><SnippetToolBox /></span>
      </Typography>

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
              {selected < snippets.length - 1 && (
                <IconButton aria-label="Next" size="large" onClick={() => onSelectSnippet(selected + 1)}>
                  <ArrowForwardIcon fontSize="large" />
                </IconButton>
              )}
              {selected === snippets.length - 1 && isEditable() && (
                <LoadingButton
                  loading={false}
                  endIcon={<SendIcon />}
                  loadingPosition="end"
                  variant="contained"
                  onClick={() => onRateChange(undefined, 'Submit ratings successfully!')}
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
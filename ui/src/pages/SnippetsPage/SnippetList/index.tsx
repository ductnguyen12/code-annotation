import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';
import { CircularProgress, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { useDatasetSnippets } from "../../../hooks/snippet";
import { SnippetRate } from "../../../interfaces/snippet.interface";
import { chooseSnippet, rateSnippetAsync } from "../../../slices/snippetsSlice";
import SnippetRating from "./SnippetRating";
import DatasetDetail from './DatasetDetail';
import SnippetCode from './SnippetCode';
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
  } = useDatasetSnippets(id ? parseInt(id) : undefined);
  const dispatch = useAppDispatch();

  const onSelectSnippet = (index: number) => {
    dispatch(chooseSnippet(index));
  }

  const onRateChange = (
    rate: number | undefined,
    comment: string | undefined,
    selectedAnswers: Set<number>,
  ): void => {
    const snippetRate: SnippetRate = {
      value: rate && rate > 0 ? rate : undefined,
      comment: comment ? comment : undefined,
      selectedAnswers: Array.from(selectedAnswers),
    }
    dispatch(rateSnippetAsync({
      snippetId: snippets[selected].id,
      rate: snippetRate,
    }));
  }

  return 'loading' === status
    ? <CircularProgress />
    : (
      <Box>
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
                rate={snippets[selected].rate?.value}
                comment={snippets[selected].rate?.comment}
                questions={snippets[selected].questions}
                onRateChange={onRateChange}
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
                {selected === snippets.length - 1 && (
                  <LoadingButton
                    loading={false}
                    endIcon={<SendIcon />}
                    loadingPosition="end"
                    variant="contained"
                    onClick={() => { }}
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
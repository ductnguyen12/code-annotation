import AddIcon from '@mui/icons-material/Add';
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CodeRating from "../../components/CodeRating";
import Spinner from "../../components/Spinner";
import { useDatasetSnippets } from "../../hooks/snippet";
import { Snippet, SnippetRate } from "../../interfaces/snippet.interface";
import { selectDatasetsState } from "../../slices/datasetsSlice";
import { chooseSnippet, loadDatasetSnippetsAsync, rateSnippetAsync } from "../../slices/snippetsSlice";
import React from 'react';
import api from '../../api';
import CreateSnippetDialog from './CreateSnippetDialog';

type RouteParams = {
  id: string,
}

const SnippetsPage = () => {
  const { id } = useParams<RouteParams>();
  const {
    status,
    snippets,
    selected,
  } = useDatasetSnippets(id ? parseInt(id) : undefined);

  const { dataset } = useAppSelector(selectDatasetsState);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

  const onCreateSnippet = async (snippet: Snippet) => {
    if (id) {
      snippet.datasetId = parseInt(id);
      return api.createSnippet(snippet)
        .then((createSnippet: Snippet) => {
          dispatch(loadDatasetSnippetsAsync(parseInt(id)));
          return createSnippet;
        });
    }
    return new Promise<Snippet>(() => snippet);
  }

  const onSelectSnippet = (index: number) => {
    dispatch(chooseSnippet(index));
  }

  const onRateChange = (rate: number | undefined, comment: string | undefined): void => {
    const snippetRate: SnippetRate = {
      value: rate && rate > 0 ? rate : undefined,
      comment: comment ? comment : undefined,
    }
    dispatch(rateSnippetAsync({
      snippetId: snippets[selected].id,
      rate: snippetRate,
    }));
  }

  return (
    <Box>
      {'loading' === status
        ? <Spinner />
        : dataset && (
          <Box>
            <Typography sx={{ mb: 1 }} variant="h5">{dataset.name}</Typography>
            <Typography
              sx={{ mb: 3 }}
              variant="body1"
            >
              {dataset.description}
            </Typography>
            <Typography sx={{ mb: 2 }} variant="h5">
              Snippets
              <span>
                <IconButton aria-label="Add snippet" onClick={() => setOpen(true)}>
                  <AddIcon />
                </IconButton>
              </span>
            </Typography>
            <CreateSnippetDialog
              open={open}
              setOpen={setOpen}
              onCreateSnippet={onCreateSnippet}
            />
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
                    showFirstButton
                    showLastButton
                  />
                  {snippets[selected].code && (
                    <Box marginTop="10px" width="90%">
                      <Typography align="center" variant="body2">
                        {snippets[selected].path}
                      </Typography>
                      <SyntaxHighlighter
                        startingLineNumber={snippets[selected].fromLine}
                        showLineNumbers={true}
                        language="cpp"
                        style={a11yDark}
                      >
                        {snippets[selected].code}
                      </SyntaxHighlighter>
                    </Box>
                  )}
                  <CodeRating
                    rate={snippets[selected].rate?.value}
                    comment={snippets[selected].rate?.comment}
                    onRateChange={onRateChange}
                  />
                </Box>
              )
              : (<Typography variant="body2">There is no snippet in this dataset</Typography>)}
          </Box>
        )
      }
    </Box>
  )
}

export default SnippetsPage;
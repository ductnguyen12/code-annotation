import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { CircularProgress, IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import React, { ChangeEvent, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import api from '../../api';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ProtectedElement from '../../components/ProtectedElement';
import { useDatasetSnippets } from "../../hooks/snippet";
import { Rater } from '../../interfaces/rater.interface';
import { Snippet, SnippetRate } from "../../interfaces/snippet.interface";
import { loadDatasetAsync, selectDatasetsState } from "../../slices/datasetsSlice";
import { chooseSnippet, loadDatasetSnippetsAsync, rateSnippetAsync } from "../../slices/snippetsSlice";
import CodeRating from "./CodeRating";
import CreateSnippetDialog from './CreateSnippetDialog';
import RaterRegistrationDialog from './RaterRegistrationDialog';

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

  const [cookies, setCookie] = useCookies(['token']);
  const [openRegistration, setOpenRegistration] = React.useState(false);

  useEffect(() => {
    if (!dataset && id) {
      dispatch(loadDatasetAsync(parseInt(id)));
    }
  }, [dataset, id, dispatch])

  useEffect(() => {
    if (!cookies.token && !openRegistration) {
      setOpenRegistration(true);
    }
  }, [cookies.token, openRegistration]);

  const onCreatedSnippet = (snippet: Snippet) => {
    if (id) {
      dispatch(loadDatasetSnippetsAsync(parseInt(id)));
    }
  };

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

  const onRegisteredRater = (rater: Rater) => {
    if (id) {
      setCookie('token', rater.id, { path: '/', maxAge: 2 << 24, secure: true });   // maxAge ~ 388 days
      dispatch(loadDatasetSnippetsAsync(parseInt(id)));
    }
  }

  const onImportSnippets = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();    // This is needed so you can actually get the currentTarget
    if (id && event.target.files && event.target.files.length > 0) {
      api.importDatasetSnippets(parseInt(id), event.target.files.item(0) as File)
        .then(() => {
          console.log("Import successfully");
          dispatch(loadDatasetSnippetsAsync(parseInt(id)));
        })
    }
  }

  const onExportSnippets = () => {
    if (id)
      api.exportDatasetSnippets(parseInt(id))
        .then(() => {
          console.log("Export successfully");
        });
  }

  return !cookies.token ? (
    <RaterRegistrationDialog
      open={openRegistration}
      setOpen={setOpenRegistration}
      onRegistered={onRegisteredRater}
    />
  ) : (
    <Box>
      {'loading' === status
        ? <CircularProgress />
        : dataset && (
          <Box>
            <Typography sx={{ mb: 1 }} variant="h5">{dataset.name}</Typography>
            <Typography
              sx={{ mb: 3 }}
              variant="body1"
            >
              {dataset.description}
            </Typography>
            <ProtectedElement hidden={true}>
              <>
                <Typography sx={{ mb: 2 }} variant="h5">
                  Snippets
                  <span>
                    <IconButton aria-label="Add snippet" onClick={() => setOpen(true)}>
                      <AddIcon />
                    </IconButton>
                    <input
                      id="import-dataset-snippets"
                      type="file"
                      accept=".zip"
                      onChange={onImportSnippets}
                      hidden={true}
                    />
                    <label htmlFor="import-dataset-snippets">
                      <IconButton aria-label="Import" component="span">
                        <FileUploadIcon />
                      </IconButton>
                    </label>
                    <IconButton aria-label="Export" onClick={onExportSnippets}>
                      <FileDownloadIcon />
                    </IconButton>
                  </span>
                </Typography>
                <CreateSnippetDialog
                  open={open}
                  setOpen={setOpen}
                  onCreated={onCreatedSnippet}
                />
              </>
            </ProtectedElement>
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
                    questions={snippets[selected].questions}
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
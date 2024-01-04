import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';

import IconButton from "@mui/material/IconButton";
import Tooltip from '@mui/material/Tooltip';
import React, { ChangeEvent, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import api from '../../../../api';
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import ProtectedElement from '../../../../components/ProtectedElement';
import { useIdFromPath } from '../../../../hooks/common';
import { Snippet } from "../../../../interfaces/snippet.interface";
import { setOpenDialog } from '../../../../slices/modelExecutionSlice';
import { pushNotification } from '../../../../slices/notificationSlice';
import { chooseRater, loadDatasetSnippetsAsync, selectSnippetsState, setRaters } from "../../../../slices/snippetsSlice";
import { defaultAPIErrorHandle } from '../../../../util/error-util';
import CreateSnippetDialog from './CreateSnippetDialog';
import RaterSelector from './RaterSelector';

const SnippetToolBox = () => {
  const datasetId = useIdFromPath();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

  const {
    selected,
    snippets,
    selectedRater,
    raters,
  } = useAppSelector(selectSnippetsState);

  const [cookies,] = useCookies(['token']);

  useEffect(() => {
    if (selected < snippets.length) {
      dispatch(setRaters(
        snippets[selected].rates?.filter(rate => rate.rater?.id !== undefined)
          .map(rate => rate.rater?.id as string)
        || []
      ));
    }
  }, [selected, snippets, dispatch]);

  useEffect(() => {
    if (raters.length > 0 && raters[0] && !selectedRater) {
      dispatch(chooseRater(raters[0]));
    }
    // eslint-disable-next-line
  }, [raters]);

  const onCreatedSnippet = (snippet: Snippet) => {
    if (datasetId) {
      dispatch(loadDatasetSnippetsAsync(datasetId));
    }
  };

  const onImportSnippets = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();    // This is needed so you can actually get the currentTarget
    if (datasetId && event.target.files && event.target.files.length > 0) {
      api.importDatasetSnippets(datasetId, event.target.files.item(0) as File)
        .then(() => {
          console.log("Import successfully");
          dispatch(loadDatasetSnippetsAsync(datasetId));
          dispatch(pushNotification({ message: `Imported snippets to dataset '${datasetId}' successfully`, variant: 'success' }));
        })
        .catch((error: any) => {
          defaultAPIErrorHandle(error, dispatch);
          throw error;
        });
    }
  }

  const onExportSnippets = () => {
    if (datasetId)
      api.exportDatasetSnippets(datasetId)
        .then(() => {
          console.log("Export successfully");
          dispatch(pushNotification({ message: `Exported snippets of dataset '${datasetId}' successfully`, variant: 'success' }));
        })
        .catch((error: any) => {
          defaultAPIErrorHandle(error, dispatch);
          throw error;
        });
  }

  const onOpenModelExecution = () => {
    dispatch(setOpenDialog(true));
  }

  const onRaterChange = (raterId: string | undefined) => {
    dispatch(chooseRater(raterId));
  }

  return (
    <ProtectedElement hidden={true}>
      <>
        <Tooltip title="Add snippet">
          <IconButton onClick={() => setOpen(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <input
          id="import-dataset-snippets"
          type="file"
          accept=".zip"
          onChange={onImportSnippets}
          hidden={true}
        />
        <label htmlFor="import-dataset-snippets">
          <Tooltip title="Import">
            <IconButton component="span">
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
        </label>
        <Tooltip title="Export">
          <IconButton onClick={onExportSnippets}>
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Prediction">
          <IconButton onClick={onOpenModelExecution}>
            <OnlinePredictionIcon />
          </IconButton>
        </Tooltip>
        <RaterSelector
          rater={selectedRater}
          raters={raters.filter(r => r !== cookies.token)}
          onRaterChange={onRaterChange}
        />
        <CreateSnippetDialog
          open={open}
          setOpen={setOpen}
          onCreated={onCreatedSnippet}
        />
      </>
    </ProtectedElement>
  )
}

export default SnippetToolBox;
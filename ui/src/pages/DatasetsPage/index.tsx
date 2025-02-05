import ArchiveIcon from '@mui/icons-material/Archive';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';

import Pagination from '@mui/material/Pagination';
import Tooltip from '@mui/material/Tooltip';
import DOMPurify from 'dompurify';
import React, { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import ConfirmationDialog from '../../components/ConfirmationDialog';
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { usePage } from '../../hooks/common';
import { useDatasets } from "../../hooks/dataset";
import { PageParams } from '../../interfaces/common.interface';
import { DatasetParams } from '../../interfaces/dataset.interface';
import { chooseDataset, deleteDatasetAsync, duplicateDatasetAsync, loadDatasetsAsync, patchDatasetThenReloadAsync } from '../../slices/datasetsSlice';
import DatasetDialog from "./DatasetDialog";
import DuplicateDialog from './DuplicateDialog';

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_SORT = 'id,desc';

const DatasetsPage = ({
  archived,
}: {
  archived?: boolean,
}) => {
  const [currentPage, setPage] = usePage();

  const pageParams = React.useMemo<PageParams>(() => ({
    page: currentPage,
    size: DEFAULT_PAGE_SIZE,
    sort: DEFAULT_SORT,
  }), [currentPage]);

  const datasetParams = React.useMemo<DatasetParams>(() => ({
    archived: !!archived,
  }), [archived]);

  const {
    status,
    totalPages,
    datasets,
    dataset,
  } = useDatasets(pageParams, datasetParams);

  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openDuplicate, setOpenDuplicate] = React.useState(false);

  const handleDuplication = useCallback((params: { withSnippet?: boolean }) => {
    dispatch(duplicateDatasetAsync({
      datasetId: dataset?.id as number,
      params,
      onSuccess: () => dispatch(loadDatasetsAsync({ pParams: pageParams, dParams: datasetParams })),
    }));
  }, [dataset?.id, datasetParams, dispatch, pageParams]);

  const handleArchivedChange = useCallback((datasetId: number) => {
    dispatch(patchDatasetThenReloadAsync({
      datasetId,
      dataset: { archived: !archived },
      pParams: pageParams,
      dParams: datasetParams,
    }));
  }, [archived, datasetParams, dispatch, pageParams]);

  const handleDeleting = useCallback(() => {
    dispatch(deleteDatasetAsync(dataset?.id as number));
  }, [dataset?.id, dispatch]);

  const handleCancelDeleting = useCallback(() => {
    dispatch(chooseDataset(-1));
  }, [dispatch]);

  const handlePageChange = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <LoadingBackdrop open={'loading' === status} />
      <Grid marginLeft={0} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {!archived && <Grid key="actions" item xs={12}>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Create
          </Button>
        </Grid>}
        <DatasetDialog
          open={open}
          setOpen={setOpen}
        />
        <ConfirmationDialog
          title="Are you sure to delete this dataset?"
          content="Deleting will cascade deleting all data related to this dataset (ratings, snippets, answers)."
          confirmColor="error"
          open={openDelete}
          setOpen={setOpenDelete}
          onConfirm={handleDeleting}
          onCancel={handleCancelDeleting}
        />
        <DuplicateDialog
          open={openDuplicate}
          onClose={() => {
            setOpenDuplicate(false);
            dispatch(chooseDataset(-1));
          }}
          onSubmit={handleDuplication}
        />
        <Grid key="pagination" item xs={12}>
          <Pagination
            className="flex justify-center"
            count={totalPages}
            page={pageParams.page + 1}
            onChange={(event, page: number) => handlePageChange(page - 1)}
          />
        </Grid>
        {datasets.map(d => (
          <Grid key={d.id} item xs={3}>
            <Card>
              <CardHeader
                title={`${d.id}. ${d.name}`}
                subheader={(
                  <div
                    className="inline-block max-h-36 overflow-hidden"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(d.description || '')
                    }}
                  />
                )}
              />
              <CardActions
                sx={{
                  justifyContent: 'space-between',
                }}
              >
                <Tooltip
                  title="To rating editor"
                  placement="bottom"
                  arrow
                >
                  <Button
                    size="small"
                    component={RouterLink}
                    to={`/datasets/${d.id}/snippets`}
                  >
                    Snippets
                  </Button>
                </Tooltip>
                <span>
                  <Tooltip
                    title="Edit"
                    placement="bottom"
                    arrow
                  >
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        dispatch(chooseDataset(d.id as number));
                        setOpen(true);
                      }}
                    >
                      <EditIcon color="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Duplicate"
                    placement="bottom"
                    arrow
                  >
                    <IconButton
                      aria-label="duplicate"
                      onClick={() => {
                        dispatch(chooseDataset(d.id as number));
                        setOpenDuplicate(true);
                      }}
                    >
                      <ContentCopyIcon color="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={archived ? "Unarchive" : "Archive"}
                    placement="bottom"
                    arrow
                  >
                    <IconButton
                      aria-label="archive"
                      onClick={() => handleArchivedChange(d.id as number)}
                    >
                      {archived ? <UnarchiveIcon color="inherit" /> : <ArchiveIcon color="inherit" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title="Delete"
                    placement="bottom"
                    arrow
                  >
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        dispatch(chooseDataset(d.id as number));
                        setOpenDelete(true);
                      }}
                    >
                      <DeleteForeverIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </span>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DatasetsPage;
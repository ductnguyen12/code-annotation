import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';

import Pagination from '@mui/material/Pagination';
import React, { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import ConfirmationDialog from '../../components/ConfirmationDialog';
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { useDatasets } from "../../hooks/dataset";
import { PageParams } from '../../interfaces/common.interface';
import { chooseDataset, deleteDatasetAsync } from '../../slices/datasetsSlice';
import DatasetDialog from "./DatasetDialog";

const DEFAULT_PAGE_SIZE = 12;

const DatasetsPage = () => {
  const [pageParams, setPageParams] = React.useState<PageParams>({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
  });
  const {
    status,
    totalPages: totalDatasets,
    datasets,
    dataset,
  } = useDatasets(pageParams);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleDeleting = useCallback(() => {
    dispatch(deleteDatasetAsync(dataset?.id as number));
  }, [dataset?.id, dispatch]);

  const handleCancelDeleting = useCallback(() => {
    dispatch(chooseDataset(-1));
  }, [dispatch]);

  const handlePageChange = useCallback((page: number) => {
    setPageParams({
      page,
      size: DEFAULT_PAGE_SIZE,
    });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <LoadingBackdrop open={'loading' === status} />
      <Grid marginLeft={0} container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid key="actions" item xs={12}>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Create
          </Button>
        </Grid>
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
        <Grid key="pagination" item xs={12}>
          <Pagination
            className="flex justify-center"
            count={totalDatasets}
            page={pageParams.page + 1}
            onChange={(event, page: number) => handlePageChange(page - 1)}
          />
        </Grid>
        {datasets.map(d => (
          <Grid key={d.id} item xs={3}>
            <Card>
              <CardHeader
                title={`${d.id}. ${d.name}`}
                subheader={d.description}
              />
              <CardActions
                sx={{
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  size="small"
                  component={RouterLink}
                  to={`/datasets/${d.id}/snippets`}
                >
                  Snippets
                </Button>
                <span>
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      dispatch(chooseDataset(d.id as number));
                      setOpen(true);
                    }}
                  >
                    <EditIcon color="inherit" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      dispatch(chooseDataset(d.id as number));
                      setOpenDelete(true);
                    }}
                  >
                    <DeleteForeverIcon color="error" />
                  </IconButton>
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { useDatasets } from "../../hooks/dataset";
import { Dataset } from "../../interfaces/dataset.interface";
import { loadDatasetsAsync } from "../../slices/datasetsSlice";
import CreateDatasetDialog from "./CreateDatasetDialog";
import DeleteDatasetDialog from "./DeleteDatasetDialog";

const DatasetsPage = () => {
  const { status, datasets } = useDatasets();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [deleteDataset, setDeleteDataset] = React.useState<Dataset | undefined>(undefined);

  const onCreatedDataset = (dataset: Dataset) => {
    dispatch(loadDatasetsAsync());
  }

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
          <CreateDatasetDialog
            open={open}
            setOpen={setOpen}
            onCreated={onCreatedDataset}
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
                <IconButton
                  aria-label="delete"
                  onClick={() => setDeleteDataset(d)}
                >
                  <DeleteForeverIcon color="error" />
                </IconButton>
              </CardActions>
            </Card>
            <DeleteDatasetDialog
              dataset={deleteDataset}
              onCancel={() => setDeleteDataset(undefined)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DatasetsPage;
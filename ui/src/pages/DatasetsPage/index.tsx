import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
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
import { chooseDataset } from '../../slices/datasetsSlice';
import DatasetDialog from "./DatasetDialog";
import DeleteDatasetDialog from "./DeleteDatasetDialog";

const DatasetsPage = () => {
  const { status, datasets } = useDatasets();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

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
            <DatasetDialog
              open={open}
              setOpen={setOpen}
            />
            <DeleteDatasetDialog
              open={openDelete}
              setOpen={setOpenDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DatasetsPage;
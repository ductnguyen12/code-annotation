import { Box, Grid } from "@mui/material";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import Spinner from "../../components/Spinner";
import { useDatasets } from "../../hooks/dataset";
import { Dataset } from "../../interfaces/dataset.interface";
import { loadDatasetsAsync } from "../../slices/datasetsSlice";
import CreateDatasetDialog from "./CreateDatasetDialog";

const DatasetsPage = () => {
  const { status, datasets } = useDatasets();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

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

      {'loading' === status
        ? <Spinner />
        : (
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
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {`${d.id}. ${d.name}`}
                    </Typography>
                    <Typography variant="body2">
                      {d.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/datasets/${d.id}/snippets`}
                    >
                      Snippets
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
    </Box>
  );
}

export default DatasetsPage;
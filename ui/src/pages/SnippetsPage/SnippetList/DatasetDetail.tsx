import Typography from "@mui/material/Typography";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useIdFromPath } from "../../../hooks/common";
import { loadDatasetAsync, selectDatasetsState } from "../../../slices/datasetsSlice";

const DatasetDetail = () => {
  const id = useIdFromPath();
  const { dataset } = useAppSelector(selectDatasetsState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!dataset && id) {
      dispatch(loadDatasetAsync(id));
    }
  }, [dataset, id, dispatch])

  return !dataset ? <></> : <>
    <Typography sx={{ mb: 1 }} variant="h5">{dataset.name}</Typography>
    <Typography
      sx={{ mb: 3 }}
      variant="body1"
    >
      {dataset.description}
    </Typography>
  </>
}

export default DatasetDetail;
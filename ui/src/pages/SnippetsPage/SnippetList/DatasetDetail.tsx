import Typography from "@mui/material/Typography";
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loadDatasetAsync, selectDatasetsState } from "../../../slices/datasetsSlice";

type RouteParams = {
  id: string,
}

const DatasetDetail = () => {
  const { id } = useParams<RouteParams>();
  const { dataset } = useAppSelector(selectDatasetsState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!dataset && id) {
      dispatch(loadDatasetAsync(parseInt(id)));
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
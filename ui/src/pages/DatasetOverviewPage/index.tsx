import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import DatasetDetail from "../../components/DatasetDetail";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { useIdFromPath } from "../../hooks/common";
import { useDatasetStatistics } from "../../hooks/dataset";
import { selectDatasetsState } from "../../slices/datasetsSlice";
import { DatasetStatisticsTable } from "./DatasetStatisticsTable";

export function DatasetOverviewPage() {
  const datasetId = useIdFromPath();
  const statistics = useDatasetStatistics(datasetId);
  const dataset = useMemo(() => statistics?.dataset, [statistics]);
  const {
    status,
  } = useAppSelector(selectDatasetsState);

  return (
    <Box>
      <LoadingBackdrop open={'loading' === status} />
      {dataset && (<DatasetDetail dataset={dataset} />)}
      <Box sx={{ mb: 3 }} />
      {statistics && (
        <DatasetStatisticsTable
          statistics={statistics}
        />
      )}
      <Box sx={{ mb: 3 }} />
      <Button
        component={RouterLink}
        to={`/datasets/${datasetId}/snippets`}
      >
        Snippets
      </Button>
    </Box>
  );
};
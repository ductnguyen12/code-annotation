import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import DatasetDetail from "../../components/DatasetDetail";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import { useIdFromPath } from "../../hooks/common";
import { useDatasetStatistics, useDatasetSubmissions } from "../../hooks/dataset";
import { useRater } from "../../hooks/rater";
import { selectDatasetsState } from "../../slices/datasetsSlice";
import DatasetStatisticsTable from "./DatasetStatisticsTable";
import RaterDetailsDialog from "./RaterDetailsDialog";
import SubmissionsTable from "./SubmissionsTable";

export function DatasetOverviewPage() {
  const datasetId = useIdFromPath();
  const statistics = useDatasetStatistics(datasetId);
  const dataset = useMemo(() => statistics?.dataset, [statistics]);
  const submissions = useDatasetSubmissions(datasetId);

  const [raterId, setRaterId] = useState<string | undefined>(undefined);
  const rater = useRater(raterId);

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
      {submissions && submissions.length > 0 && (
        <>
          <Typography sx={{ mb: 2 }} variant="h5">
            Submissions
          </Typography>
          <SubmissionsTable
            submissions={submissions}
            onClickRater={(rId: string) => setRaterId(rId)}
          />
        </>
      )}
      <Box sx={{ mb: 3 }} />
      <Button
        component={RouterLink}
        to={`/datasets/${datasetId}/snippets`}
      >
        Snippets
      </Button>
      <RaterDetailsDialog
        rater={rater}
        open={!!raterId}
        onClose={() => setRaterId(undefined)}
      />
    </Box>
  );
};
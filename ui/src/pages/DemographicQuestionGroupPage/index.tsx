import {
  Box
} from "@mui/material";
import Typography from '@mui/material/Typography';

import { useAppSelector } from "../../app/hooks";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import ProtectedElement from "../../components/ProtectedElement";
import { selectDemographicQuestionGroupState } from "../../slices/demographicQuestionGroupSlice";
import DemographicQuestionGroupDialog from "./DemographicQuestionGroupDialog";
import DemographicQuestionGroupTable from "./DemographicQuestionGroupTable";
import DemographicQuestionGroupToolBox from "./DemographicQuestionGroupToolBox";

const DemographicQuestionGroupPage = () => {
  const {
    status,
  } = useAppSelector(selectDemographicQuestionGroupState);

  return (
    <ProtectedElement>
      <>
        <LoadingBackdrop open={'loading' === status} />
        <Typography sx={{ mb: 1 }} variant="h5">
          Question Group Management
          <span><DemographicQuestionGroupToolBox /></span>
        </Typography>
        <DemographicQuestionGroupDialog />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <DemographicQuestionGroupTable />
        </Box>
      </>
    </ProtectedElement>
  );
}

export default DemographicQuestionGroupPage;
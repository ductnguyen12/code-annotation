import {
  Box
} from "@mui/material";
import Typography from '@mui/material/Typography';

import { useAppSelector } from "../../app/hooks";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import ProtectedElement from "../../components/ProtectedElement";
import { useDemographicQuestionGroups } from "../../hooks/demographicQuestion";
import { selectDemographicQuestionGroupState } from "../../slices/demographicQuestionGroupSlice";
import DemographicQuestionDialog from "./DemographicQuestionDialog";
import DemographicQuestionTable from "./DemographicQuestionTable";
import DemographicQuestionToolBox from "./DemographicQuestionToolBox";

const DemographicQuestionPage = () => {
  const {
    status,
  } = useAppSelector(selectDemographicQuestionGroupState);

  useDemographicQuestionGroups();

  return (
    <ProtectedElement>
      <>
        <LoadingBackdrop open={'loading' === status} />
        <Typography sx={{ mb: 1 }} variant="h5">
          Demographic Question Management
          <span><DemographicQuestionToolBox /></span>
        </Typography>
        <DemographicQuestionDialog />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <DemographicQuestionTable />
        </Box>
      </>
    </ProtectedElement>
  );
}

export default DemographicQuestionPage;
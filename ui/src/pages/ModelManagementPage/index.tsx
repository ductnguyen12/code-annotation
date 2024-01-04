import {
  Box
} from "@mui/material";
import Typography from '@mui/material/Typography';

import { useAppSelector } from "../../app/hooks";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import ProtectedElement from "../../components/ProtectedElement";
import { selectModelState } from "../../slices/modelSlice";
import ModelManagementDialog from "./ModelManagementDialog";
import ModelManagementTable from "./ModelManagementTable";
import ModelManagementToolBox from "./ModelManagementToolBox";

const ModelManagementPage = () => {
  const {
    status,
  } = useAppSelector(selectModelState);

  return (
    <ProtectedElement>
      <>
        <LoadingBackdrop open={'loading' === status} />
        <Typography sx={{ mb: 1 }} variant="h5">
          Model Management
          <span><ModelManagementToolBox /></span>
        </Typography>
        <ModelManagementDialog />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ModelManagementTable />
        </Box>
      </>
    </ProtectedElement>
  );
}

export default ModelManagementPage;
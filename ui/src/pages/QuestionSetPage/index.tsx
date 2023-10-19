import {
  Box
} from "@mui/material";
import Typography from '@mui/material/Typography';

import { useAppSelector } from "../../app/hooks";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import ProtectedElement from "../../components/ProtectedElement";
import { selectQuestionSetState } from "../../slices/questionSetSlice";
import QuestionSetDialog from "./QuestionSetDialog";
import QuestionSetTable from "./QuestionSetTable";
import QuestionSetToolBox from "./QuestionSetToolBox";

const QuestionSetPage = () => {
  const {
    status,
  } = useAppSelector(selectQuestionSetState);

  return (
    <ProtectedElement>
      <>
        <LoadingBackdrop open={'loading' === status} />
        <Typography sx={{ mb: 1 }} variant="h5">
          Question Group Management
          <span><QuestionSetToolBox /></span>
        </Typography>
        <QuestionSetDialog />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <QuestionSetTable />
        </Box>
      </>
    </ProtectedElement>
  );
}

export default QuestionSetPage;
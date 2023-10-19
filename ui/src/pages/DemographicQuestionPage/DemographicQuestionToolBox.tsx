import AddIcon from '@mui/icons-material/Add';
import { IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectDemographicQuestionState, setOpenDialog } from '../../slices/demographicQuestionSlice';

const DemographicQuestionToolBox = () => {
  const {
    openDialog,
  } = useAppSelector(selectDemographicQuestionState);

  const dispatch = useAppDispatch();

  return (
    <>
      <IconButton aria-label="Add demographic question" onClick={() => dispatch(setOpenDialog(!openDialog))}>
        <AddIcon />
      </IconButton>
    </>
  )
}

export default DemographicQuestionToolBox;
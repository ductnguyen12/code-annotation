import AddIcon from '@mui/icons-material/Add';
import { IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectDemographicQuestionGroupState, setOpenDialog } from '../../slices/demographicQuestionGroupSlice';

const DemographicQuestionGroupToolBox = () => {
  const {
    openDialog,
  } = useAppSelector(selectDemographicQuestionGroupState);

  const dispatch = useAppDispatch();

  return (
    <>
      <IconButton aria-label="Add question group" onClick={() => dispatch(setOpenDialog(!openDialog))}>
        <AddIcon />
      </IconButton>
    </>
  )
}

export default DemographicQuestionGroupToolBox;
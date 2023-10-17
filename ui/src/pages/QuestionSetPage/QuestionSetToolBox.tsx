import AddIcon from '@mui/icons-material/Add';
import { IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectQuestionSetState, setOpenDialog } from '../../slices/questionSetSlice';

const QuestionSetToolBox = () => {
  const {
    openDialog,
  } = useAppSelector(selectQuestionSetState);

  const dispatch = useAppDispatch();

  return (
    <>
      <IconButton aria-label="Add question set" onClick={() => dispatch(setOpenDialog(!openDialog))}>
        <AddIcon />
      </IconButton>
    </>
  )
}

export default QuestionSetToolBox;
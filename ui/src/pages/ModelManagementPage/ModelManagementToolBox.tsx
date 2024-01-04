import AddIcon from '@mui/icons-material/Add';
import { IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectModelState, setOpenDialog } from '../../slices/modelSlice';

const ModelManagementToolBox = () => {
  const {
    openDialog,
  } = useAppSelector(selectModelState);

  const dispatch = useAppDispatch();

  return (
    <>
      <IconButton aria-label="Add model" onClick={() => dispatch(setOpenDialog(!openDialog))}>
        <AddIcon />
      </IconButton>
    </>
  )
}

export default ModelManagementToolBox;
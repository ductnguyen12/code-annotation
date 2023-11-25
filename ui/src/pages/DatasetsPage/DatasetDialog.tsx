import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import { FC, ReactElement, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import FormDialog from "../../components/FormDialog"
import { Dataset } from "../../interfaces/dataset.interface"
import {
  chooseDataset,
  createDatasetAsync,
  selectDatasetsState,
  updateConfiguration,
  updateDatasetAsync
} from "../../slices/datasetsSlice"
import { PROGRAMMING_LANGUAGES } from "../../util/programming-languages"
import DemographicQuestionGroupSelector from "./DemographicQuestionGroupSelector"
import RaterMgmtSelector from "./RaterMgmtSelector"

type DatasetDialogProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
}

const DatasetDialog: FC<DatasetDialogProps> = ({
  open,
  setOpen,
}): ReactElement => {
  const { register, handleSubmit, setValue, reset } = useForm<Dataset>();
  const dispatch = useAppDispatch();

  const {
    dataset,
    demographicQuestionGroupIds,
    configuration,
  } = useAppSelector(selectDatasetsState);

  useEffect(() => {
    if (dataset) {
      (Object.keys(dataset) as (keyof Dataset)[]).forEach(key => {
        setValue(key, dataset[key]);
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [dataset, setValue, reset]);

  const handleSetHiddenQuestions = (checked: boolean) => {
    dispatch(updateConfiguration({ key: "hiddenQuestions", value: { value: checked } }));
  }

  const handleChangeLanguage = (newLanguege: string) => {
    if (newLanguege)
      setValue('pLanguage', newLanguege);
  };

  const handleClose = () => {
    dispatch(chooseDataset(-1));
  }

  const onSubmission = async (newDataset: Dataset) => {
    newDataset.demographicQuestionGroupIds = demographicQuestionGroupIds;
    newDataset.configuration = configuration;

    if (!!dataset) {
      dispatch(updateDatasetAsync({ datasetId: dataset.id as number, dataset: newDataset }));
    } else {
      dispatch(createDatasetAsync(newDataset));
    }
    return newDataset;
  };

  return (
    <FormDialog<Dataset>
      title={`${dataset ? 'Update' : 'Create'} Dataset`}
      open={open}
      setOpen={setOpen}
      onSubmit={onSubmission}
      onClose={handleClose}
      handleSubmit={handleSubmit}
    >
      <TextField
        id="name"
        label="Name"
        variant="outlined"
        size="small"
        {...register('name')}
      />
      <TextField
        id="description"
        label="Description"
        variant="outlined"
        size="small"
        multiline
        rows={3}
        {...register('description')}
      />
      <FormControlLabel
        control={<Checkbox />}
        checked={!!configuration?.hiddenQuestions?.value}
        onChange={(_, checked) => handleSetHiddenQuestions(checked)}
        label="Hide snippet questions before rating"
      />
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="programming-language" size="small">Language</InputLabel>
        <Select
          labelId="programming-language"
          id="programming-language-select"
          label="Language"
          size="small"
          defaultValue=""
          onChange={e => handleChangeLanguage(e.target.value as string)}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {PROGRAMMING_LANGUAGES.map(pl => (
            <MenuItem key={pl} value={pl}>{pl}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <RaterMgmtSelector />
      <DemographicQuestionGroupSelector />
    </FormDialog>
  );
}

export default DatasetDialog;
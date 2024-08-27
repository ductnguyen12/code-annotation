import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import { FC, ReactElement, useCallback, useEffect, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import DemographicQuestionGroupSelector from "../../components/DemographicQuestionGroupSelector"
import FormDialog from "../../components/FormDialog"
import WYSIWYGEditor from "../../components/WYSIWYGEditor"
import { useDemographicQuestionGroups } from "../../hooks/demographicQuestion"
import { Dataset, RaterMgmtSystem } from "../../interfaces/dataset.interface"
import {
  chooseDataset,
  createDatasetAsync,
  deleteConfiguration,
  selectDatasetsState,
  updateConfiguration,
  updateDatasetAsync
} from "../../slices/datasetsSlice"
import { EXTENDED_PROGRAMMING_LANGUAGES } from "../../util/programming-languages"
import RaterMgmtSelector from "./RaterMgmtSelector"

type DatasetDialogProps = {
  open: boolean,
  setOpen: (open: boolean) => void,
}

const DatasetDialog: FC<DatasetDialogProps> = ({
  open,
  setOpen,
}): ReactElement => {
  const methods = useForm<any>();
  const { register, handleSubmit, setValue, reset, control } = methods;
  const dispatch = useAppDispatch();

  const {
    dataset,
    configuration,
  } = useAppSelector(selectDatasetsState);

  const {
    questionGroups,
  } = useDemographicQuestionGroups();

  const [pLanguage, setPLanguage] = useState('');

  useEffect(() => {
    if (dataset) {
      (Object.keys(dataset) as (keyof Dataset)[]).forEach(key => {
        setValue(key, dataset[key]);
      });
    } else {
      reset({
        name: '',
        description: '',
        completeText: '',
      });
    }
    setPLanguage(dataset?.pLanguage || '');
  }, [dataset, setValue, reset]);

  const handleSetHidingComment = useCallback((checked: boolean) => {
    dispatch(updateConfiguration({ key: "hideComment", value: { value: checked } }));
  }, [dispatch]);

  const handleSetHiddenQuestions = useCallback((checked: boolean) => {
    dispatch(updateConfiguration({ key: "hiddenQuestions", value: { value: checked } }));
  }, [dispatch]);

  const handleSetAllowNoRating = useCallback((checked: boolean) => {
    dispatch(updateConfiguration({ key: "allowNoRating", value: { value: checked } }));
  }, [dispatch]);

  const handleSystemChange = useCallback((oldValue: RaterMgmtSystem, newValue: RaterMgmtSystem) => {
    dispatch(deleteConfiguration({ key: oldValue.toLowerCase() }));
  }, [dispatch]);

  const handleChangeLanguage = useCallback((newLanguage: string) => {
    if (newLanguage) {
      setValue('pLanguage', newLanguage);
      setPLanguage(newLanguage);
    }
  }, [setValue]);

  const handleClose = useCallback(() => {
    dispatch(chooseDataset(-1));
    setOpen(false);
  }, [dispatch, setOpen]);

  const onSubmission = async (newDataset: any) => {
    newDataset.demographicQuestionGroupIds = newDataset.groupIds;
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
      onSubmit={onSubmission}
      onClose={handleClose}
      handleSubmit={handleSubmit}
    >
      <FormProvider {...methods}>
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          size="small"
          {...register('name')}
        />
        <Controller
          render={({ field: { value, onChange, onBlur } }) => (
            <WYSIWYGEditor
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Description"
            />
          )}
          control={control}
          name="description"
        />
        <FormControlLabel
          control={<Checkbox />}
          checked={!!configuration?.hideComment?.value}
          onChange={(_, checked) => handleSetHidingComment(checked)}
          label="Hide comment box"
        />
        <FormControlLabel
          control={<Checkbox />}
          checked={!!configuration?.hiddenQuestions?.value}
          onChange={(_, checked) => handleSetHiddenQuestions(checked)}
          label="Hide snippet questions before rating"
        />
        <FormControlLabel
          control={<Checkbox />}
          checked={!!configuration?.allowNoRating?.value}
          onChange={(_, checked) => handleSetAllowNoRating(checked)}
          label="Allow no rating"
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="programming-language" size="small">Language</InputLabel>
          <Select
            labelId="programming-language"
            id="programming-language-select"
            label="Language"
            size="small"
            value={pLanguage}
            defaultValue=""
            onChange={e => handleChangeLanguage(e.target.value as string)}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {EXTENDED_PROGRAMMING_LANGUAGES.map(pl => (
              <MenuItem key={pl} value={pl}>{pl}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <RaterMgmtSelector
          onSystemChange={handleSystemChange}
        />
        <DemographicQuestionGroupSelector
          questionGroups={questionGroups}
          selectedIds={dataset?.demographicQuestionGroupIds}
        />
        <Controller
          render={({ field: { value, onChange, onBlur } }) => (
            <WYSIWYGEditor
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Complete text (e.g. Thank you for participating in our survey!)"
            />
          )}
          control={control}
          name="completeText"
        />
      </FormProvider>
    </FormDialog>
  );
}

export default DatasetDialog;
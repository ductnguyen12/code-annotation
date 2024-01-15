import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DemographicQuestionGroupSelector from '../../components/DemographicQuestionGroupSelector';
import FormDialog from "../../components/FormDialog";
import { DemographicQuestion, DemographicQuestionGroup, QuestionType } from "../../interfaces/question.interface";
import { selectDemographicQuestionGroupState } from "../../slices/demographicQuestionGroupSlice";
import { createDemographicQuestionAsync, selectDemographicQuestionState, setOpenDialog, setSelected, updateDemographicQuestionAsync } from "../../slices/demographicQuestionSlice";
import { selectSnippetsState } from '../../slices/snippetsSlice';
import SnippetSelectorContainer from './SnippetSelectorContainer';

interface OptionData {
  option: string;
  correct?: boolean;
  isInput?: boolean;
}

const DEFAULT_TYPE = Object.keys(QuestionType)[0] as QuestionType;

const DemographicQuestionDialog = (): ReactElement => {
  const { register, handleSubmit, getValues, setValue, reset, } = useForm<DemographicQuestion>();
  const {
    openDialog,
    selected,
  } = useAppSelector(selectDemographicQuestionState);

  const {
    questionGroups,
  } = useAppSelector(selectDemographicQuestionGroupState);

  const snippets = useAppSelector(selectSnippetsState).snippets;

  const dispatch = useAppDispatch();

  const [options, setOptions] = useState<OptionData[]>([]);
  const [newOption, setNewOption] = useState<string | undefined>(undefined);
  const [attributes, setAttributes] = useState<string[]>([]);
  const [newAttribute, setNewAttribute] = useState<string | undefined>(undefined);
  const [questionType, setQuestionType] = useState<QuestionType>(DEFAULT_TYPE);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [datasetIndex, setDatasetIndex] = useState(0);
  const [snippetIndex, setSnippetIndex] = useState(0);

  useEffect(() => {
    setOptions(
      selected?.answer?.options?.map((option: string, i: number): OptionData => {
        const correct = selected.answer?.correctChoices?.includes(i);
        const isInput = selected.answer?.inputPositions?.includes(i);
        return {
          option,
          correct,
          isInput,
        };
      })
      || []
    );
    setAttributes(selected?.answer?.attributes || []);
    setQuestionType(selected ? selected.type : DEFAULT_TYPE);
    setSelectedGroups(selected?.groupIds || []);

    (Object.keys(getValues()) as (keyof DemographicQuestion)[])
      .forEach(key => setValue(key, selected ? selected[key] : undefined));
  }, [selected, getValues, setValue]);

  useEffect(() => {
    if (QuestionType.INPUT === questionType)
      setOptions([]);
    if (QuestionType.RATING !== questionType)
      setAttributes([]);
  }, [questionType]);

  const onSubmission = async (question: DemographicQuestion) => {
    question.type = questionType;
    question.groupIds = selectedGroups;
    question.answer = {
      attributes,
      options: options.map(option => option.option),
      correctChoices: options.filter((option, i) => option.correct).map((_, i) => i),
      inputPositions: options.map((option, i) => [option, i])
        .filter(pair => (pair[0] as OptionData).isInput)
        .map(pair => pair[1] as number),
    }
    if (QuestionType.SNIPPET === question.type) {
      question.content = JSON.stringify({
        id: snippets[snippetIndex].id,
        code: snippets[snippetIndex].code,
        path: snippets[snippetIndex].path,
        fromLine: snippets[snippetIndex].fromLine,
        toLine: snippets[snippetIndex].toLine,
        datasetId: snippets[snippetIndex].id,
      });
    }
    if (!!selected) {
      dispatch(updateDemographicQuestionAsync({ questionId: selected.id as number, question }));
    } else {
      dispatch(createDemographicQuestionAsync(question));
    }

    return question;
  };

  const resetForm = () => {
    dispatch(setSelected(undefined));
    setNewOption(undefined);
    setOptions([]);
    setAttributes([]);
    setNewAttribute(undefined);
    setQuestionType(DEFAULT_TYPE);
    setSelectedGroups([]);
    setDatasetIndex(0);
    reset();
  }

  const handleGroupsChange = (newGroups: DemographicQuestionGroup[]) => {
    setSelectedGroups(newGroups.map(group => group.id as number));
  }

  const handleAddOption = () => {
    if (!newOption)
      return;
    setOptions([...options, { option: newOption }]);
  }

  const handleRemoveOption = (index: number) => {
    setOptions([...options.slice(0, index), ...options.slice(index + 1)]);
  }

  const handleAddAttribute = () => {
    if (!newAttribute)
      return;
    setAttributes([...attributes, newAttribute]);
  }

  const handleRemoveAttribute = (index: number) => {
    setAttributes([...attributes.slice(0, index), ...attributes.slice(index + 1)]);
  }

  const handleDatasetChange = useCallback((index: number) => setDatasetIndex(index), []);
  const handleSnippetChange = useCallback((index: number) => setSnippetIndex(index), []);

  const title = useMemo(
    () => !!selected ? `Edit Demographic Question ID ${selected.id}` : "Create Demographic Question",
    [selected],
  );

  return (
    <FormDialog<DemographicQuestion>
      title={title}
      open={openDialog}
      setOpen={(open: boolean) => dispatch(setOpenDialog(open))}
      onSubmit={onSubmission}
      onSuccess={resetForm}
      onClose={resetForm}
      handleSubmit={handleSubmit}
    >
      {QuestionType.SNIPPET !== questionType && (<TextField
        id="content"
        label="Content"
        variant="outlined"
        size="small"
        {...register('content')}
      />)}

      {/* ===== Snippet selector ===== */}
      {QuestionType.SNIPPET === questionType && (
        <SnippetSelectorContainer
          datasetIndex={datasetIndex}
          snippetIndex={snippetIndex}
          onDatasetChange={handleDatasetChange}
          onSnippetChange={handleSnippetChange}
        />
      )}

      {/* ===== Question type ===== */}
      <FormControl fullWidth>
        <InputLabel id="question-type" size="small">Question type</InputLabel>
        <Select
          labelId="question-type"
          id="question-type-select"
          label="Question type"
          size="small"
          value={questionType}
          onChange={e => setQuestionType(e.target.value as QuestionType)}
        >
          {Object.keys(QuestionType).map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ===== Constraint ===== */}
      <FormControl component="fieldset" variant="standard">
        <FormLabel component="legend">Constraint</FormLabel>
        <FormGroup sx={{ display: 'flex', flexDirection: 'row', }}>
          <FormControlLabel
            control={
              <Checkbox {...register('constraint.required')} />
            }
            label="Required"
          />
          <FormControlLabel
            control={
              <Checkbox {...register('constraint.isNumber')} />
            }
            label="Input is a number"
          />
        </FormGroup>
      </FormControl>

      {/* ===== Question group ===== */}
      <DemographicQuestionGroupSelector
        questionGroups={questionGroups}
        selectedIds={selectedGroups}
        onValuesChange={handleGroupsChange}
      />

      {/* ===== Options ===== */}
      {[
        QuestionType.SINGLE_CHOICE,
        QuestionType.MULTIPLE_CHOICE,
        QuestionType.RATING,
      ].includes(questionType) && (
          <FormControl component="fieldset" variant="standard">
            <FormLabel component="legend">Options</FormLabel>
            <FormGroup
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                mt: 1,
                mb: 2,
              }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder="Please input new option"
                sx={{ width: '90%' }}
                onChange={(e) => setNewOption(e.target.value)}
              />
              <IconButton
                color="primary"
                sx={{ width: '10%' }}
                aria-label="Add this option"
                onClick={handleAddOption}
              >
                <AddIcon />
              </IconButton>
            </FormGroup>
            <FormGroup>
              {options.map((option, i) => (
                <Box key={i} sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', width: '90%', mb: 1 }}
                  >
                    <TextField
                      key={i}
                      variant="outlined"
                      size="small"
                      value={option.option}
                      onChange={(e) => {
                        options[i].option = e.target.value;
                        setOptions([...options]);
                      }}
                    />
                    <span>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!option.correct}
                            onChange={(_, checked) => {
                              options[i].correct = checked;
                              setOptions([...options]);
                            }}
                          />
                        }
                        label="Correct"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!option.isInput}
                            onChange={(_, checked) => {
                              options[i].isInput = checked;
                              setOptions([...options]);
                            }}
                          />
                        }
                        label="Is input"
                      />
                    </span>
                  </Box>
                  <IconButton
                    color="error"
                    sx={{ width: '10%', height: 'fit-content' }}
                    aria-label="Remove this option"
                    onClick={() => handleRemoveOption(i)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
            </FormGroup>
          </FormControl>
        )}

      {/* ===== Attributes ===== */}
      {QuestionType.RATING === questionType && (
        <FormControl component="fieldset" variant="standard">
          <FormLabel component="legend">Attributes</FormLabel>
          <FormGroup
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mt: 1,
              mb: 2,
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Please input new option"
              sx={{ width: '90%' }}
              onChange={(e) => setNewAttribute(e.target.value)}
            />
            <IconButton
              color="primary"
              sx={{ width: '10%' }}
              aria-label="Add this attribute"
              onClick={handleAddAttribute}
            >
              <AddIcon />
            </IconButton>
          </FormGroup>
          <FormGroup>
            {attributes.map((attribute, i) => (
              <Box key={i} sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
                <TextField
                  key={i}
                  variant="outlined"
                  size="small"
                  value={attribute}
                  sx={{ width: '90%' }}
                  onChange={(e) => {
                    const newAttributes = [...attributes];
                    newAttributes[i] = e.target.value;
                    setAttributes(newAttributes);
                  }}
                />
                <IconButton
                  color="error"
                  sx={{ width: '10%', height: 'fit-content' }}
                  aria-label="Remove this attribute"
                  onClick={() => handleRemoveAttribute(i)}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
          </FormGroup>
        </FormControl>
      )}
    </FormDialog>
  );
};

export default DemographicQuestionDialog;
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import DemographicQuestionGroupSelector from "../../components/DemographicQuestionGroupSelector";
import QuestionDialog from '../../components/QuestionDialog';
import { useDatasets } from "../../hooks/dataset";
import { useDatasetSnippets } from "../../hooks/snippet";
import { Dataset } from "../../interfaces/dataset.interface";
import { DemographicQuestion } from "../../interfaces/question.interface";
import { selectDemographicQuestionGroupState } from "../../slices/demographicQuestionGroupSlice";
import { createDemographicQuestionAsync, selectDemographicQuestionState, setOpenDialog, setSelected, updateDemographicQuestionAsync } from "../../slices/demographicQuestionSlice";

export default function DemographicQuestionDialog() {
  const {
    openDialog,
    selected,
  } = useAppSelector(selectDemographicQuestionState);

  const {
    questionGroups,
  } = useAppSelector(selectDemographicQuestionGroupState);

  const dispatch = useAppDispatch();

  const datasets = useDatasets().datasets;
  const [dataset, setDataset] = useState<Dataset | undefined>(datasets.length > 0 ? datasets[0] : undefined);

  const snippets = useDatasetSnippets(dataset?.id).snippets;

  useEffect(() => {
    setDataset(datasets.length > 0 ? datasets[0] : undefined)
  }, [datasets]);

  const handleSubmit = useCallback((newQuestion: DemographicQuestion) => {
    if (!!selected) {
      dispatch(updateDemographicQuestionAsync({ questionId: selected.id as number, question: newQuestion }));
    } else {
      dispatch(createDemographicQuestionAsync(newQuestion));
    }
  }, [dispatch, selected]);

  const handleClose = useCallback(() => {
    dispatch(setOpenDialog(false));
    dispatch(setSelected(undefined));
    setDataset(datasets.length > 0 ? datasets[0] : undefined);
  }, [datasets, dispatch]);

  const handleDatasetChange = useCallback((d: Dataset) => setDataset(d), []);

  return (
    <QuestionDialog
      open={openDialog}
      question={selected}
      datasets={datasets}
      snippets={snippets}
      children={[
        (
          <DemographicQuestionGroupSelector
            key="group-selector"
            questionGroups={questionGroups}
            selectedIds={selected?.groupIds || []}
          />
        )
      ]}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onDatasetChange={handleDatasetChange}
    />
  );
};
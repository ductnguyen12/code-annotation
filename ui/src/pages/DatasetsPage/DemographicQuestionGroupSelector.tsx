import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import CheckboxesTags from "../../components/CheckboxesTags";
import { useDemographicQuestionGroups } from "../../hooks/demographicQuestion";
import { DemographicQuestionGroup } from "../../interfaces/question.interface";
import { selectDatasetsState, setDemograhpicQuestions } from "../../slices/datasetsSlice";

export default function DemographicQuestionGroupSelector() {
  const dispatch = useAppDispatch();
  const {
    demographicQuestionGroupIds: dQuestionGroupIds,
  } = useAppSelector(selectDatasetsState);

  const {
    questionGroups,
  } = useDemographicQuestionGroups();

  const selectedGroups = useMemo(
    () => questionGroups.filter((group: DemographicQuestionGroup) => dQuestionGroupIds.includes(group.id as number)),
    [questionGroups, dQuestionGroupIds],
  );

  const handleValuesChange = (newGroups: DemographicQuestionGroup[]) => {
    dispatch(setDemograhpicQuestions(newGroups.map(group => group.id as number)));
  }

  return (
    <CheckboxesTags
      label="Demographic Question Groups"
      htmlId="demographic-question-groups-selector"
      placeholder="Select demographic question groups"
      options={questionGroups}
      value={selectedGroups}
      getOptionLabel={(option: DemographicQuestionGroup) => `${option.id}. ${option.title}`}
      onChange={handleValuesChange}
    />
  );
};
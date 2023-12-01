import { useMemo } from "react";
import CheckboxesTags from "./CheckboxesTags";
import { DemographicQuestionGroup } from "../interfaces/question.interface";

export default function DemographicQuestionGroupSelector({
  questionGroups,
  selectedIds,
  onValuesChange,
}: {
  questionGroups: DemographicQuestionGroup[],
  selectedIds: number[],
  onValuesChange: (newGroups: DemographicQuestionGroup[]) => void,
}) {

  const selectedGroups = useMemo(
    () => questionGroups.filter((group: DemographicQuestionGroup) => selectedIds.includes(group.id as number)),
    [questionGroups, selectedIds],
  );

  return (
    <CheckboxesTags
      label="Demographic Question Groups"
      htmlId="demographic-question-groups-selector"
      placeholder="Select demographic question groups"
      options={questionGroups}
      value={selectedGroups}
      getOptionLabel={(option: DemographicQuestionGroup) => `${option.id}. ${option.title}`}
      onChange={onValuesChange}
    />
  );
};
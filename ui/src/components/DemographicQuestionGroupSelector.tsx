import { useCallback, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { DemographicQuestionGroup } from "../interfaces/question.interface";
import CheckboxesTags from "./CheckboxesTags";

export default function DemographicQuestionGroupSelector({
  questionGroups,
  selectedIds,
}: {
  questionGroups: DemographicQuestionGroup[],
  selectedIds?: number[],
}) {
  const { register, watch, setValue } = useFormContext();
  const groupIds = watch('groupIds', []);

  const selectedGroups = useMemo(
    () => questionGroups.filter((group: DemographicQuestionGroup) => groupIds.includes(group.id as number)),
    [questionGroups, groupIds],
  );

  useEffect(() => {
    const ids = selectedIds || [];
    register('groupIds', { value: ids });
    setValue('groupIds', ids);
  }, [register, selectedIds, setValue]);

  const handleGroupsChange = useCallback((newGroups: DemographicQuestionGroup[]) => {
    setValue('groupIds', newGroups.map(g => g.id as number));
  }, [setValue]);

  return (
    <CheckboxesTags
      label="Demographic Question Groups"
      htmlId="demographic-question-groups-selector"
      placeholder="Select demographic question groups"
      options={questionGroups}
      value={selectedGroups}
      getOptionLabel={(option: DemographicQuestionGroup) => `${option.id}. ${option.title}`}
      onChange={handleGroupsChange}
    />
  );
};
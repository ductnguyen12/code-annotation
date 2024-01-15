import { useEffect, useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import SnippetSelector from "../../components/SnippetSelector";
import { useDatasets } from "../../hooks/dataset";
import { useDatasetSnippets } from "../../hooks/snippet";
import { QuestionType } from "../../interfaces/question.interface";
import { selectDemographicQuestionState } from "../../slices/demographicQuestionSlice";

export default function SnippetSelectorContainer({
  datasetIndex,
  snippetIndex,
  onDatasetChange,
  onSnippetChange,
}: {
  datasetIndex: number;
  snippetIndex: number;
  onDatasetChange: (index: number) => void;
  onSnippetChange: (index: number) => void;
}) {
  const selected = useAppSelector(selectDemographicQuestionState).selected;
  const datasets = useDatasets().datasets;

  const datasetId = useMemo(() => datasets.length > datasetIndex ? datasets[datasetIndex].id : undefined, [datasets, datasetIndex]);
  const currentSnippet = useMemo(
    () => QuestionType.SNIPPET === selected?.type && selected.content
      ? JSON.parse(selected.content)
      : undefined,
    [selected]
  );

  const snippets = useDatasetSnippets(datasetId).snippets;

  useEffect(() => {
    if (currentSnippet) {
      const newDatasetIndex = datasets.findIndex(d => d.id === currentSnippet.datasetId);
      if (newDatasetIndex > -1)
        onDatasetChange(newDatasetIndex);
    }
  }, [currentSnippet, datasets, onDatasetChange]);

  useEffect(() => {
    if (datasetId && datasetId !== currentSnippet?.datasetId) {
      onSnippetChange(0);
    } else if (datasetId === currentSnippet?.datasetId) {
      const newSnippetIndex = snippets.findIndex(s => s.id === currentSnippet.id);
      if (newSnippetIndex > -1) {
        onSnippetChange(newSnippetIndex);
      }
    }
  }, [snippets, datasetId, currentSnippet, onSnippetChange]);

  return (
    <SnippetSelector
      datasets={datasets}
      snippets={snippets}
      datasetIndex={datasetIndex}
      snippetIndex={snippetIndex}
      onDatasetChange={(index: number): void => onDatasetChange(index)}
      onSnippetChange={(index: number): void => onSnippetChange(index)}
    />
  );
}
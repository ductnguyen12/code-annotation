import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Dataset } from "../../interfaces/dataset.interface";
import { Snippet } from "../../interfaces/snippet.interface";
import SnippetSelector from "../SnippetSelector";

export default function SnippetSelectorContainer({
  content,
  datasets,
  snippets,
  onDatasetChange,
}: {
  content?: string,
  datasets?: Dataset[],
  snippets?: Snippet[],
  onDatasetChange?: (dataset: Dataset) => void,
}) {
  const { setValue } = useFormContext();
  const selectedSnippet = useMemo(() => {
    try {
      if (content) {
        const snippet = JSON.parse(content) as Snippet;
        return snippet;
      }
    } catch (e) {
      console.error('Failed to parse question content to preview snippet', e, content);
    }
    return undefined;
  }, [content]);

  const handleDatasetChange = useCallback((index: number) =>
    datasets && datasets.length > index && onDatasetChange && onDatasetChange(datasets[index]),
    [datasets, onDatasetChange],
  );

  const handleSnippetChange = useCallback((index: number) => {
    if (!snippets?.length) {
      return;
    }
    setValue('content', JSON.stringify({
      id: snippets[index].id,
      code: snippets[index].code,
      path: snippets[index].path,
      fromLine: snippets[index].fromLine,
      toLine: snippets[index].toLine,
      datasetId: snippets[index].id,
    }));
  }, [setValue, snippets]);

  return (
    <SnippetSelector
      selectedSnippet={selectedSnippet}
      datasets={!datasets ? [] : datasets as Dataset[]}
      snippets={!snippets ? [] : snippets as Snippet[]}
      onDatasetChange={handleDatasetChange}
      onSnippetChange={handleSnippetChange}
    />
  )
}
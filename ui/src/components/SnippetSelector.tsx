import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useCallback, useEffect, useState } from "react";
import { Dataset } from "../interfaces/dataset.interface";
import { Snippet } from "../interfaces/snippet.interface";

export default function SnippetSelector({
  datasets,
  snippets,
  selectedSnippet,
  onDatasetChange,
  onSnippetChange,
}: {
  datasets: Dataset[],
  snippets: Snippet[],
  selectedSnippet?: Snippet,    // Previously selected (update scenario)
  onDatasetChange: (index: number) => void,
  onSnippetChange: (index: number) => void,
}) {
  const [datasetIndex, setDatasetIndex] = useState<number>(datasets.length > 0 ? 0 : -1);
  const [snippetIndex, setSnippetIndex] = useState<number>(-1);

  const handleSnippetChange = useCallback((index: number) => {
    if (index < snippets.length) {
      setSnippetIndex(index);
      onSnippetChange(index);
    }
  }, [onSnippetChange, snippets.length]);

  const handleDatasetChange = useCallback((index: number) => {
    setDatasetIndex(index);
    setSnippetIndex(0);
    onDatasetChange(index);
  }, [onDatasetChange]);

  useEffect(() => {
    if (selectedSnippet) {
      handleDatasetChange(datasets.findIndex(d => d.id === selectedSnippet.datasetId));
    }
  }, [datasets, handleDatasetChange, selectedSnippet]);

  useEffect(() => {
    if (!selectedSnippet && snippets.length > 0) {
      handleSnippetChange(0);
    } else if (selectedSnippet) {
      const index = snippets.findIndex(s => s.id === selectedSnippet.id);
      if (index > -1 && index < snippets.length) {
        handleSnippetChange(index);
      }
    } else {
      setSnippetIndex(-1);
    }
  }, [snippets, selectedSnippet, handleSnippetChange]);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="output-format" size="small">Dataset</InputLabel>
        <Select
          labelId="output-format"
          id="output-format-select"
          label="Output format"
          size="small"
          required
          value={datasetIndex}
          onChange={e => handleDatasetChange(e.target.value as number)}
        >
          {datasets.length === 0 && (<MenuItem value={-1} disabled>No dataset</MenuItem>)}
          {datasets.map((dataset, index) => (
            <MenuItem key={dataset.id} value={index}>{dataset.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="output-format" size="small">Snippet</InputLabel>
        <Select
          labelId="output-format"
          id="output-format-select"
          label="Output format"
          size="small"
          required
          value={snippetIndex}
          onChange={e => handleSnippetChange(e.target.value as number)}
        >
          {snippetIndex === -1 && (<MenuItem value={-1} disabled>No snippet</MenuItem>)}
          {snippets.map((snippet, index) => (
            <MenuItem key={snippet.id} value={index}>{snippet.path}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Dataset } from "../interfaces/dataset.interface";
import { Snippet } from "../interfaces/snippet.interface";

export default function SnippetSelector({
  datasets,
  snippets,
  datasetIndex,
  snippetIndex,
  onDatasetChange,
  onSnippetChange,
}: {
  datasets: Dataset[],
  snippets: Snippet[],
  datasetIndex: number,
  snippetIndex: number,
  onDatasetChange: (index: number) => void,
  onSnippetChange: (index: number) => void,
}) {
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
          onChange={e => onDatasetChange(e.target.value as number)}
        >
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
          onChange={e => onSnippetChange(e.target.value as number)}
        >
          {snippets.map((snippet, index) => (
            <MenuItem key={snippet.id} value={index}>{snippet.path}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Rater } from "../../../../interfaces/rater.interface";

const RaterSelector = ({
  rater,
  raters,
  onRaterChange,
}: {
  rater?: Rater,
  raters: Array<Rater>,
  onRaterChange: (rater?: Rater) => void,
}) => {

  const handleRaterChange = (raterId: string) => {
    onRaterChange(raters.find(r => r.id === raterId));
  }

  return (
    <FormControl size="small" sx={{ ml: 1, minWidth: 353 }}>
      <InputLabel id="rater-selector-label">Rater</InputLabel>
      <Select
        labelId="rater-selector-label"
        id="rater-selector"
        size="small"
        value={raters.find(r => r.id === rater?.id)?.id || ""}
        label="Rater"
        onChange={e => handleRaterChange(e.target.value)}
      >
        {raters.map(r => (<MenuItem key={r.id} value={r.id as string}>{r.externalId || r.id}</MenuItem>))}
      </Select>
      <FormHelperText>Select rater to display his/her ratings and solutions</FormHelperText>
    </FormControl>
  );
}

export default RaterSelector;
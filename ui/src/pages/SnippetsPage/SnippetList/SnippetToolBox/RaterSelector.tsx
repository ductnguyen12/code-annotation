import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const RaterSelector = ({
  rater,
  raters,
  onRaterChange,
}: {
  rater?: string,
  raters: Array<string>,
  onRaterChange: (raterId: string | undefined) => void,
}) => {

  const handleRaterChange = (value: string) => {
    if (value === 'You') {
      onRaterChange(undefined);
    } else {
      onRaterChange(value);
    }
  }

  return (
    <FormControl size="small" sx={{ ml: 1, minWidth: 353 }}>
      <InputLabel id="rater-selector-label">Rater</InputLabel>
      <Select
        labelId="rater-selector-label"
        id="rater-selector"
        size="small"
        value={rater || "You"}
        label="Rater"
        onChange={e => handleRaterChange(e.target.value)}
      >
        <MenuItem value="You">
          <em>You</em>
        </MenuItem>
        {raters.map(r => (<MenuItem key={r} value={r}>{r}</MenuItem>))}
      </Select>
      <FormHelperText>Select rater to display his/her ratings and solutions</FormHelperText>
    </FormControl>
  );
}

export default RaterSelector;
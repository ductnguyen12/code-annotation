import TextField from "@mui/material/TextField";
import { useState } from "react";
import { ProlificConfig } from "../../../interfaces/prolific.interface";

const DEFAULT_PROLIFIC_CONFIG = {
  completeCode: '',
};

const ProlificForm = ({
  onChange,
}: {
  onChange: (newValue: any) => void,
}) => {

  const [config, setConfig] = useState<ProlificConfig>(DEFAULT_PROLIFIC_CONFIG);

  const handleChange = (key: keyof ProlificConfig, value: any) => {
    config[key] = value;
    setConfig({ ...config });
    onChange(config);
  }

  return (
    <TextField
      id="complete-code"
      label="Complete code"
      variant="outlined"
      placeholder="Complete code"
      size="small"
      required
      onChange={e => handleChange('completeCode', e.target.value)}
    />
  )
}

export default ProlificForm;
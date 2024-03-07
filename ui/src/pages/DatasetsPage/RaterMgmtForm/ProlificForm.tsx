import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { ProlificConfig } from "../../../interfaces/prolific.interface";
import { selectDatasetsState } from "../../../slices/datasetsSlice";

const DEFAULT_PROLIFIC_CONFIG = {
  completeCode: '',
  'secrets.apyKey': undefined,
};

const ProlificForm = ({
  onChange,
}: {
  onChange: (newValue: any) => void,
}) => {
  const [config, setConfig] = useState<ProlificConfig>(DEFAULT_PROLIFIC_CONFIG);

  const {
    dataset,
  } = useAppSelector(selectDatasetsState);

  useEffect(() => {
    if (!!dataset?.configuration?.prolific) {
      const prolific = dataset?.configuration?.prolific;
      (Object.keys(config) as (keyof ProlificConfig)[]).forEach(key => config[key] = prolific[key]);
      setConfig({ ...config });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset?.configuration?.prolific]);

  const handleChange = (key: keyof ProlificConfig, value: any) => {
    config[key] = value;
    setConfig({ ...config });
    onChange(config);
  }

  return (
    <>
      <TextField
        id="complete-code"
        label="Complete code"
        variant="outlined"
        placeholder="Complete code"
        size="small"
        required
        value={config.completeCode}
        onChange={e => handleChange('completeCode', e.target.value)}
      />
      <TextField
        id="api-key"
        label="API key"
        variant="outlined"
        placeholder="API key"
        size="small"
        required
        value={config['secrets.apyKey']}
        onChange={e => handleChange('secrets.apyKey', e.target.value)}
      />
    </>
  )
}

export default ProlificForm;
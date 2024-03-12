import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { ProlificConfig } from "../../../interfaces/prolific.interface";
import { selectDatasetsState } from "../../../slices/datasetsSlice";

const DEFAULT_PROLIFIC_CONFIG = {
  completeCode: '',
  'secrets.apiKey': undefined,
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
      const newConfig = { ...config };
      (Object.keys(config) as (keyof ProlificConfig)[]).forEach(key => newConfig[key] = prolific[key]);
      setConfig(newConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset?.configuration?.prolific]);

  useEffect(() => {
    onChange(config);
  }, [onChange, config]);

  const handleChange = (key: keyof ProlificConfig, value: any) => {
    const newConfig = { ...config };
    newConfig[key] = value;
    setConfig(newConfig);
    onChange(newConfig);
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
        value={config?.completeCode}
        onChange={e => handleChange('completeCode', e.target.value)}
      />
      <TextField
        id="api-key"
        label="API key"
        variant="outlined"
        placeholder="API key"
        size="small"
        required
        value={config ? config['secrets.apiKey'] : undefined}
        onChange={e => handleChange('secrets.apiKey', e.target.value)}
      />
    </>
  )
}

export default ProlificForm;
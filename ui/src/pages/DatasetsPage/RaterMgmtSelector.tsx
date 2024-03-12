import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import { RaterMgmtSystem } from "../../interfaces/dataset.interface"
import { selectDatasetsState } from "../../slices/datasetsSlice"
import RaterMgmtForm from "./RaterMgmtForm"

const RaterMgmtSelector = ({
  onSystemChange,
}: {
  onSystemChange?: (oldValue: RaterMgmtSystem, newValue: RaterMgmtSystem) => void;
}) => {
  const [system, setSystem] = useState<RaterMgmtSystem>(RaterMgmtSystem.LOCAL);

  const {
    dataset,
  } = useAppSelector(selectDatasetsState);

  const handleSystemChange = (newValue: RaterMgmtSystem) => {
    setSystem(newValue);
    onSystemChange && onSystemChange(system, newValue);
  }

  useEffect(() => {
    if (!!dataset?.configuration?.prolific) {
      setSystem(RaterMgmtSystem.PROLIFIC);
    }
  }, [dataset]);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="rater-management-system" size="small">Rater management</InputLabel>
        <Select
          labelId="rater-management-system"
          id="rater-management-system-select"
          label="Rater management"
          size="small"
          value={system}
          onChange={e => handleSystemChange(e.target.value as RaterMgmtSystem)}
        >
          {Object.keys(RaterMgmtSystem).map(system => (
            <MenuItem key={system as string} value={system as string}>{system as string}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <RaterMgmtForm
        system={system}
      />
    </>
  )
}

export default RaterMgmtSelector;
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import { useState } from "react"
import { RaterMgmtSystem } from "../../interfaces/dataset.interface"
import RaterMgmtForm from "./RaterMgmtForm"

const RaterMgmtSelector = () => {
  const [system, setSystem] = useState<RaterMgmtSystem>(RaterMgmtSystem.LOCAL);

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="rater-management-system" size="small">Rater management</InputLabel>
        <Select
          labelId="rater-management-system"
          id="rater-management-system-select"
          label="Rater management"
          size="small"
          defaultValue={RaterMgmtSystem.LOCAL}
          onChange={e => setSystem(e.target.value as RaterMgmtSystem)}
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
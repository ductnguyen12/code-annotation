import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';

import FormControl from "@mui/material/FormControl";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from "react-hook-form";
import { QuestionType } from '../../interfaces/question.interface';

function SubOptionCheckBox({
  index,
  subOpt,
  basePath,
}: {
  index: number,
  subOpt: { label: string, path: string },
  basePath: string,
}) {
  const { register, watch } = useFormContext();
  const checked = watch(`${basePath}.${index}.${subOpt.path}`);

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked || false}
          {...register(`${basePath}.${index}.${subOpt.path}`)}
        />
      }
      label={subOpt.label}
    />
  )
}

export default function QuestionOptions({
  label,
  valuePath,
  subOptions,
}: {
  label: string,
  valuePath: string,
  subOptions?: Array<{ label: string, path: string }>,
}) {
  const { register, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: valuePath,
  });

  const [newOption, setNewOption] = useState<string | undefined>(undefined);
  const questionType = watch<any>('type') as QuestionType;

  useEffect(() => {
    setNewOption(undefined);
  }, [questionType]);


  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          mt: 1,
          mb: 2,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Please input new option"
          sx={{ width: '90%' }}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <IconButton
          color="primary"
          sx={{ width: '10%' }}
          onClick={() => append({
            value: newOption,
          })}
        >
          <AddIcon />
        </IconButton>
      </FormGroup>
      <FormGroup>
        {fields.map((_, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'row', mb: 1 }}>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', width: '90%', mb: 1 }}
            >
              <TextField
                key={i}
                variant="outlined"
                size="small"
                {...register(`${valuePath}.${i}.value`)}
              />
              {subOptions && (<span>
                {subOptions.map(subOpt => (
                  <SubOptionCheckBox
                    key={subOpt.path}
                    index={i}
                    subOpt={subOpt}
                    basePath={valuePath}
                  />
                ))}
              </span>)}
            </Box>
            <IconButton
              color="error"
              sx={{ width: '10%', height: 'fit-content' }}
              aria-label="Remove this option"
              onClick={() => remove(i)}
            >
              <RemoveIcon />
            </IconButton>
          </Box>
        ))}
      </FormGroup>
    </FormControl>
  );
}
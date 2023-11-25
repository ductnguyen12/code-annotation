import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CheckboxesTags({
  label,
  options,
  value,
  htmlId,
  placeholder,
  getOptionLabel,
  onChange,
}: {
  label: string,
  options: any[],
  value?: any[],
  htmlId?: string,
  placeholder?: string,
  getOptionLabel?: (option: any) => string,
  onChange?: (newValues: any[]) => void,
}) {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      size="small"
      id={htmlId || 'checkboxes-tags'}
      options={options}
      value={value}
      getOptionLabel={getOptionLabel}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {getOptionLabel ? getOptionLabel(option) : option.label}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} size="small" />
      )}
      onChange={((_, newValue) => onChange && onChange(newValue))}
    />
  );
}
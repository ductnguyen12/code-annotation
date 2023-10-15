import FormControlLabel from "@mui/material/FormControlLabel"
import FormLabel from "@mui/material/FormLabel"
import Radio from "@mui/material/Radio"
import RadioGroup from "@mui/material/RadioGroup"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"

const MultipleRating = ({
  name,
  options,
  attributes,
  selected,
  onValueChange,
}: {
  name: string,
  options: Array<string>,
  attributes: Array<string>,
  selected: Array<number>,
  onValueChange: (selected: number, index: number) => void;
}) => {
  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell />
          {options.map((option, index) => (<TableCell key={index} align="right">{option}</TableCell>))}
        </TableRow>
      </TableHead>
      <TableBody>
        {attributes.map((attribute, index) => (
          <TableRow
            key={index}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              <FormLabel id={`${name}-attr-${index}`}>{attribute}</FormLabel>
            </TableCell>
            <RadioGroup
              aria-labelledby={`${name}-attr-${index}`}
              name={name}
              value={selected[index] > -1 ? selected[index] : undefined}
              onChange={e => onValueChange(parseInt(e.target.value), index)}
            >
              {options.map((_, i) => (
                <TableCell key={i} align="right">
                  <FormControlLabel value={i} control={<Radio />} label={undefined} />
                </TableCell>
              ))}
            </RadioGroup>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default MultipleRating;
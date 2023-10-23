import FormLabel from "@mui/material/FormLabel"
import Radio from "@mui/material/Radio"
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
            {options.map((_, i) => (
              <TableCell key={i} align="right">
                <Radio
                  checked={i === selected[index]}
                  value={i}
                  onChange={e => onValueChange(parseInt(e.target.value), index)}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default MultipleRating;
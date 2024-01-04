import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ModelExecution } from "../../../interfaces/model.interface";

const headers = [
  "ID",
  "Target",
  "Target ID",
  "Model ID",
  "State",
  "Last update",
];

const fields: (keyof ModelExecution)[] = [
  "id",
  "targetType",
  "targetId",
  "modelId",
  "state",
  "lastModifiedDate",
];

const ModelExecutionTable = ({
  executions,
}: {
  executions: ModelExecution[],
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (<TableCell key={index} align="center">{header}</TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {executions.map((execution, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {fields.map((field) => (
                <TableCell key={field} align="center">{execution[field] as string}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ModelExecutionTable;
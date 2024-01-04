import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import { ReactElement } from "react"

const headers = [
  "Metric",
  "Value",
];

const MetricsDialog = ({
  metrics,
  open,
  onClose,
}: {
  metrics?: {
    [key: string]: number;
  },
  open: boolean,
  onClose: () => void,
}): ReactElement => {

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Metrics</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (<TableCell key={index} align="center">{header}</TableCell>))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(metrics ? Object.keys(metrics) : []).map(metric => (
                <TableRow
                  key={metric}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="center">{metric}</TableCell>
                  <TableCell align="center">{(metrics as any)[metric]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetricsDialog;
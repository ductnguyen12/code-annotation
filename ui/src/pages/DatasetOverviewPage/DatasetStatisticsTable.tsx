import StarIcon from '@mui/icons-material/Star';
import { Box } from '@mui/material';
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { DatasetStatistics } from "../../interfaces/dataset.interface";

export default function DatasetStatisticsTable({
  statistics,
}: {
  statistics: DatasetStatistics,
}) {
  return (
    <TableContainer sx={{ maxWidth: 500 }} component={Paper}>
      <Table aria-label="Dataset Statistics">
        <TableBody>
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell variant="head"><strong>Average rating</strong></TableCell>
            <TableCell align="center">
              <Box
                display="flex"
              >
                <Rating
                  readOnly
                  precision={0.5}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  value={Math.floor(statistics.averageRating * 2) / 2}
                />
                <span style={{
                  paddingTop: '3px',
                  marginLeft: '3px',
                }}>({statistics.averageRating})</span>
              </Box>
            </TableCell>
          </TableRow>
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell variant="head"><strong>Number of snippets</strong></TableCell>
            <TableCell align="center">{statistics.numberOfSnippets}</TableCell>
          </TableRow>
          <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell variant="head"><strong>Number of participants</strong></TableCell>
            <TableCell align="center">{statistics.numberOfParticipants}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
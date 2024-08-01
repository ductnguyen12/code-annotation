import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React from "react";
import { Submission } from '../../interfaces/submission.interface';

const headers = [
  "ID",
  "Rater ID",
  "External ID",
  "Status",
  "Attention check",
  "Number of ratings",
  "Started time",
  "Completed time",
];

export default function SubmissionsTable({
  submissions,
  onClickRater,
}: {
  submissions: Submission[],
  onClickRater?: (raterId: string) => void,
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - submissions.length) : 0;

  const handleChangePage = React.useCallback((
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  }, [setPage]);

  const handleChangeRowsPerPage = React.useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, [setPage]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="Submissions">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (<TableCell key={index} align="center">{header}</TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? submissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : submissions
          ).map((submission, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{submission.id}</TableCell>
              <TableCell align="left">
                <Button
                  className="normal-case"
                  variant="text"
                  onClick={() => onClickRater && onClickRater(submission.rater.id as string)}
                >
                  {submission.rater.id}
                </Button>
              </TableCell>
              <TableCell align="left">
                <Button
                  className="normal-case"
                  variant="text"
                  onClick={() => onClickRater && onClickRater(submission.rater.id as string)}
                >
                  {submission.rater.externalId}
                </Button>
              </TableCell>
              <TableCell align="center">{submission.status}</TableCell>
              <TableCell align="center">
                <Box className="flex items-center justify-center">
                  {submission.passedAttentionCheck < submission.totalAttentionCheck
                    ? (<CancelOutlinedIcon color="error" />)
                    : (<CheckCircleOutlinedIcon color="success" />)}
                  <span>{submission.passedAttentionCheck}/{submission.totalAttentionCheck}</span>
                </Box>
              </TableCell>
              <TableCell align="center">
                <Box className="flex items-center justify-center">
                  {submission.numberOfRatings < submission.numberOfSnippets
                    ? (<CancelOutlinedIcon color="error" />)
                    : (<CheckCircleOutlinedIcon color="success" />)}
                  <span>{submission.numberOfRatings}/{submission.numberOfSnippets}</span>
                </Box>
              </TableCell>
              <TableCell align="center">{submission.startedAt}</TableCell>
              <TableCell align="center">{submission.startedAt}</TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 73 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, { label: 'All', value: -1 }]}
              colSpan={3}
              count={submissions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};
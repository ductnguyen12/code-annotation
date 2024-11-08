import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from '@mui/material/Tooltip';
import React from "react";
import { useAppDispatch } from '../../app/hooks';
import { useIdFromPath } from '../../hooks/common';
import { Submission } from '../../interfaces/submission.interface';
import { exportSnippetsAsync } from '../../slices/datasetsSlice';
import { formatMilliseconds } from '../../util/time-util';

const headers = [
  "ID",
  "Rater ID",
  "External ID",
  "Status",
  "Attention check",
  "Failed attention check consistency",
  "Number of ratings",
  "Started time",
  "Duration",
];

export default function SubmissionsTable({
  submissions,
  onClickRater,
}: {
  submissions: Submission[],
  onClickRater?: (raterId: string) => void,
}) {
  const datasetId = useIdFromPath();
  const dispatch = useAppDispatch();

  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const numSelected = React.useMemo(() => selected.length, [selected.length]);

  const rows = React.useMemo(() => rowsPerPage > 0
    ? submissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : submissions,
    [page, rowsPerPage, submissions]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = React.useMemo(() => page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - submissions.length)
    : 0,
    [page, rowsPerPage, submissions.length]
  );

  const getRowId = React.useCallback((index: number) => page * rowsPerPage + index, [page, rowsPerPage]);

  const allSelected = React.useMemo(() => rows.every((_, i) => selected.includes(getRowId(i))), [getRowId, rows, selected]);

  const anySelected = React.useMemo(() => rows.some((_, i) => selected.includes(getRowId(i))), [getRowId, rows, selected]);

  const isSelected = React.useCallback((id: number) => selected.indexOf(id) !== -1, [selected]);

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

  const handleSelectAllClick = React.useCallback(() => {
    const rowIds = rows.map((_, i) => getRowId(i));
    if (anySelected) {
      setSelected(selected.filter(id => !rowIds.includes(id)));
      return;
    }
    const newSelected = [...selected, ...rows.map((_, i) => getRowId(i))];
    setSelected(newSelected);
  }, [anySelected, getRowId, rows, selected]);

  const handleSelectClick = React.useCallback((checked: boolean, id: number) => {
    const newSelected = checked ? [...selected, id] : selected.filter(i => id !== i);
    setSelected(newSelected);
  }, [selected]);

  const handleExportClick = React.useCallback(() => {
    const raterIds = selected.map(i => submissions[i].rater.id as string);
    dispatch(exportSnippetsAsync({
      datasetId: datasetId as number,
      raterIds,
    }));
  }, [datasetId, dispatch, selected, submissions]);

  return (
    <TableContainer component={Paper}>
      <Box>
        <FormControlLabel
          className='pl-3.5'
          control={
            <Checkbox
              checked={numSelected > 0 && allSelected}
              indeterminate={numSelected > 0 && !allSelected && anySelected}
              onChange={handleSelectAllClick}
              inputProps={{
                'aria-label': 'Select all',
              }}
            />
          }
          label={numSelected ? `${numSelected} items selected` : ''}
        />
        {numSelected ? (<Tooltip title="Export" arrow>
          <IconButton onClick={handleExportClick}>
            <FileDownloadIcon />
          </IconButton>
        </Tooltip>) : <></>}
      </Box>
      <Table sx={{ minWidth: 500 }} aria-label="Submissions">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox"></TableCell>
            {headers.map((header, index) => (<TableCell key={index} align="center">{header}</TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((submission, index) => {
            const id = getRowId(index);
            const isItemSelected = isSelected(id);
            const labelId = `table-checkbox-${id}`;

            return (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                selected={isItemSelected}
                aria-checked={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                    onChange={(_, checked) => handleSelectClick(checked, id)}
                  />
                </TableCell>
                <TableCell align="left">{submission.id}</TableCell>
                <TableCell align="left">
                  <Button
                    sx={{
                      textTransform: "none",
                    }}
                    variant="text"
                    onClick={() => onClickRater && onClickRater(submission.rater.id as string)}
                  >
                    {submission.rater.id}
                  </Button>
                </TableCell>
                <TableCell align="center">{submission.rater.externalId}</TableCell>
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
                  {submission.consistentFailedAttentionCheck}/{submission.totalAttentionCheck - submission.passedAttentionCheck}
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
                <TableCell align="center">
                  {submission.duration
                    ? formatMilliseconds(submission.duration)
                    : ''}
                </TableCell>
              </TableRow>
            );
          })}
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
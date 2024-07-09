import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import QuestionComponent from "../../components/QuestionComponent";
import { Question } from "../../interfaces/question.interface";
import { Rater } from "../../interfaces/rater.interface";

export default function RaterDetailsDialog({
  datasetConfiguration,
  rater,
  open,
  onClose,
}: {
  datasetConfiguration?: any,
  rater?: Rater,
  open?: boolean,
  onClose: () => void,
}) {
  return (
    <Dialog
      maxWidth="lg"
      fullWidth={true}
      open={!!open}
      onClose={onClose}
    >
      <DialogTitle>Rater {rater?.id} {rater?.externalId ? `- ${rater?.externalId}` : ''}</DialogTitle>
      <DialogContent>
        {rater?.solutions?.map((solution, index) => (
          <Paper
            key={index}
            elevation={4}
            sx={{
              p: 3,
              m: 2,
              borderRadius: '12px',
            }}
          >
            <QuestionComponent
              questionIndex={index}
              question={solution.question as Question}
              solution={solution}
              hideComment={!!datasetConfiguration?.hideComment?.value}
              allowNoRating={!!datasetConfiguration?.allowNoRating?.value}
              onValueChange={(..._) => { }}
            />
          </Paper>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
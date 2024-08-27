import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DOMPurify from 'dompurify';
import { useIdFromPath } from '../hooks/common';
import { useDataset } from '../hooks/dataset';

export default function SurveyCompletePage() {
  const datasetId = useIdFromPath();
  const dataset = useDataset(datasetId);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={3}
    >
      <ThumbUpIcon color="info" sx={{ fontSize: "10rem" }} />
      <Typography variant="h3">
        Thank you for participating in our survey
      </Typography>
      <center>
        <Typography
          mt={4}
          variant="body1"
        >
          <div
            className="inline-block"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(dataset?.completeText || '')
            }}
          />
        </Typography>
      </center>
    </Box>
  );
}

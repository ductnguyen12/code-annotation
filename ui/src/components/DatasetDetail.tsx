import Typography from "@mui/material/Typography";
import DOMPurify from "dompurify";
import { Dataset } from "../interfaces/dataset.interface";

const DatasetDetail = ({
  dataset,
}: {
  dataset: Dataset,
}) => {
  return <>
    <Typography sx={{ mb: 1 }} variant="h5">{dataset.name}</Typography>
    <Typography
      variant="body1"
    >
      <div
        className="inline-block"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(dataset.description || '')
        }}
      />
    </Typography>
  </>
}

export default DatasetDetail;
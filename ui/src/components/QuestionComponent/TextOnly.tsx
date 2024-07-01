import Box from "@mui/material/Box";
import DOMPurify from "dompurify";
import { Question } from "../../interfaces/question.interface";

export default function TextOnly({
  question,
}: {
  question: Question,
  [key: string]: any,
}) {
  return (
    <Box>
      <div
        className="inline-block"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(question.content || '')
        }}
      />
    </Box>
  );
}
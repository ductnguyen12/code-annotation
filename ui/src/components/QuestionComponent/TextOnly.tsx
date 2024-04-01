import Box from "@mui/material/Box";
import { Question } from "../../interfaces/question.interface";

export default function TextOnly({
  question,
}: {
  question: Question,
  [key: string]: any,
}) {
  return (
    <Box>{question.content}</Box>
  );
}
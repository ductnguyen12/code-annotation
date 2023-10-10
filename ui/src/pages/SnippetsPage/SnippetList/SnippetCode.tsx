import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useAppSelector } from "../../../app/hooks";
import { selectSnippetsState } from "../../../slices/snippetsSlice";

const SnippetCode = () => {
  const {
    snippets,
    selected,
  } = useAppSelector(selectSnippetsState);

  return snippets[selected].code ? (
    <Box marginTop="10px" width="90%">
      <Typography align="center" variant="body2">
        {snippets[selected].path}
      </Typography>
      <SyntaxHighlighter
        startingLineNumber={snippets[selected].fromLine}
        showLineNumbers={true}
        language="cpp"
        style={a11yDark}
      >
        {snippets[selected].code}
      </SyntaxHighlighter>
    </Box>
  ) : <></>
}

export default SnippetCode;
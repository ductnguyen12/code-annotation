import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useAppSelector } from "../../../app/hooks";
import { selectSnippetsState } from "../../../slices/snippetsSlice";

const extLanguageMap = new Map([
  ['cc', 'cpp'],
  ['js', 'javascript'],
  ['jsx', 'javascript'],
  ['ts', 'typescript'],
  ['tsx', 'typescript'],
  ['sh', 'bash'],
  ['', 'bash'],
  ['cs', 'csharp'],
  ['py', 'python'],
  ['kt', 'kotlin'],
  ['kts', 'kotlin'],
  ['rs', 'rust'],
])

const SnippetCode = () => {
  const {
    snippets,
    selected,
  } = useAppSelector(selectSnippetsState);

  const getExtension = (snippetPath: string) => {
    const parts = snippetPath.trim().split('.');
    const ext = parts[parts.length - 1];
    return extLanguageMap.has(ext) ? extLanguageMap.get(ext) : ext;
  }

  return snippets[selected].code ? (
    <Box marginTop="10px" width="90%">
      <Typography align="center" variant="body2">
        {snippets[selected].path}
      </Typography>
      <SyntaxHighlighter
        startingLineNumber={snippets[selected].fromLine}
        showLineNumbers={true}
        language={getExtension(snippets[selected].path)}
        style={a11yDark}
      >
        {snippets[selected].code}
      </SyntaxHighlighter>
    </Box>
  ) : <></>
}

export default SnippetCode;
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as highlighters from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Snippet } from "../../interfaces/snippet.interface";
import { EXT_LANGUAGE_MAP, PROGRAMMING_LANGUAGES } from "../../util/programming-languages";

const SnippetCode = ({
  snippet,
}: {
  snippet?: Snippet;
}) => {

  const [language, setLanguage] = useState<string>('');
  const [highlighter, setHighlighter] = useState<{ name: string, hl: { [key: string]: React.CSSProperties; } }>({
    name: 'a11yDark',
    hl: highlighters.a11yDark
  });

  const getExtension = useCallback(
    (snippetPath: string) => {
      const parts = snippetPath.trim().split('.');
      const ext = parts[parts.length - 1];
      return EXT_LANGUAGE_MAP.has(ext) ? EXT_LANGUAGE_MAP.get(ext) : ext;
    }, []
  );

  const handleChangeLanguage = useCallback(
    (newLanguege: string) => {
      if (EXT_LANGUAGE_MAP.has(newLanguege))
        setLanguage(newLanguege);
    }, []
  );

  const handleChangeStyle = useCallback(
    (newHighlighterName: string) => {
      const newHighlighter = Object.entries(highlighters)
        .map(entry => ({
          name: entry[0],
          hl: entry[1],
        }))
        .find(hl => hl.name === newHighlighterName);
      if (newHighlighter)
        setHighlighter(newHighlighter);
    }, []
  );

  useEffect(() => {
    if (snippet) {
      handleChangeLanguage(getExtension(snippet.path) || '');
    }
  }, [snippet, handleChangeLanguage, getExtension]);

  return snippet?.code ? (
    <Container maxWidth="lg">
      <Typography align="center" variant="body2" marginBottom={2}>
        {snippet.path}
      </Typography>
      <Box>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="programming-language" size="small">Language</InputLabel>
          <Select
            labelId="programming-language"
            id="programming-language-select"
            label="Language"
            size="small"
            value={language}
            onChange={e => handleChangeLanguage(e.target.value as string)}
          >
            {PROGRAMMING_LANGUAGES.map(pl => (
              <MenuItem key={pl} value={pl}>{pl}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ ml: 1, minWidth: 230 }}>
          <InputLabel id="highlighter" size="small">Highlighter</InputLabel>
          <Select
            labelId="highlighter"
            id="highlighter-select"
            label="Highlighter"
            size="small"
            value={highlighter.name}
            onChange={e => handleChangeStyle(e.target.value as string)}
          >
            {Object.keys(highlighters).map(hl => (
              <MenuItem key={hl} value={hl}>{hl}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <SyntaxHighlighter
        startingLineNumber={snippet.fromLine}
        showLineNumbers={true}
        language={language}
        wrapLines
        style={highlighter.hl}
      >
        {snippet.code}
      </SyntaxHighlighter>
    </Container>
  ) : <></>
}

export default SnippetCode;
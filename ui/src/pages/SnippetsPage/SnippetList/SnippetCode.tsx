import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as highlighters from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useAppSelector } from "../../../app/hooks";
import { selectSnippetsState } from "../../../slices/snippetsSlice";
import { EXT_LANGUAGE_MAP, PROGRAMMING_LANGUAGES } from "../../../util/programming-languages";

const SnippetCode = () => {
  const {
    snippets,
    selected,
  } = useAppSelector(selectSnippetsState);

  const [language, setLanguage] = useState<string>('');
  const [highlighter, setHighlighter] = useState<{ name: string, hl: { [key: string]: React.CSSProperties; } }>({
    name: 'a11yDark',
    hl: highlighters.a11yDark
  });

  const getExtension = (snippetPath: string) => {
    const parts = snippetPath.trim().split('.');
    const ext = parts[parts.length - 1];
    return EXT_LANGUAGE_MAP.has(ext) ? EXT_LANGUAGE_MAP.get(ext) : ext;
  }

  const handleChangeLanguage = (newLanguege: string) => {
    setLanguage(newLanguege);
  };

  const handleChangeStyle = (newHighlighterName: string) => {
    const newHighlighter = Object.entries(highlighters)
      .map(entry => ({
        name: entry[0],
        hl: entry[1],
      }))
      .find(hl => hl.name === newHighlighterName);
    if (newHighlighter)
      setHighlighter(newHighlighter);
  };

  useEffect(() => {
    if (snippets[selected]) {
      handleChangeLanguage(getExtension(snippets[selected].path) || '');
    }
  }, [snippets, selected]);

  return snippets[selected].code ? (
    <Box marginTop="10px" width="90%">
      <Typography align="center" variant="body2">
        {snippets[selected].path}
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
        startingLineNumber={snippets[selected].fromLine}
        showLineNumbers={true}
        language={language}
        style={highlighter.hl}
      >
        {snippets[selected].code}
      </SyntaxHighlighter>
    </Box>
  ) : <></>
}

export default SnippetCode;
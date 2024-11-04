import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as highlighters from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Snippet } from "../../interfaces/snippet.interface";
import { EXT_LANGUAGE_MAP, PROGRAMMING_LANGUAGES } from "../../util/programming-languages";

const SUPPORTED_HIGHLIGHTERS = {
  androidstudio: highlighters.androidstudio,
  arduinoLight: highlighters.arduinoLight,
  atomOneDark: highlighters.atomOneDark,
  atomOneLight: highlighters.atomOneLight,
  atomOneDarkReasonable: highlighters.atomOneDarkReasonable,
  stackoverflowLight: highlighters.stackoverflowLight,
  stackoverflowDark: highlighters.stackoverflowDark,
}

const SnippetCode = ({
  snippet,
  defaultPLanguage,
  disableLanguageSelector,
  highlighterMaxHeight,
}: {
  snippet?: Snippet;
  defaultPLanguage?: string;
  disableLanguageSelector?: boolean;
  highlighterMaxHeight?: string;
}) => {

  const [language, setLanguage] = useState<string>('');
  const [highlighter, setHighlighter] = useState<{ name: string, hl: { [key: string]: React.CSSProperties; } }>({
    name: 'atomOneDark',
    hl: highlighters.atomOneDark
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
      if (PROGRAMMING_LANGUAGES.includes(newLanguege))
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

  useEffect(() => {
    if (defaultPLanguage && PROGRAMMING_LANGUAGES.includes(defaultPLanguage)) {
      handleChangeLanguage(defaultPLanguage);
    }
  }, [defaultPLanguage, handleChangeLanguage]);

  return snippet?.code ? (
    <Container maxWidth="xl">
      <Box>
        {!disableLanguageSelector && (<Tooltip
          title="Choose another programming language code editor"
          placement="right-end"
          arrow
        >
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
        </Tooltip>)}
        <Tooltip
          title="Choose another theme for the code editor"
          placement="left-end"
          arrow
        >
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
              {Object.keys(SUPPORTED_HIGHLIGHTERS).map(hl => (
                <MenuItem key={hl} value={hl}>{hl}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Tooltip>
      </Box>
      {snippet?.attentionCheck && (
        <Typography className="pt-4" variant="h5">
          This is an attention check.
          Please give this snippet <b>{snippet?.correctRating} stars</b> to pass.
        </Typography>
      )}
      <SyntaxHighlighter
        customStyle={{ maxHeight: highlighterMaxHeight }}
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
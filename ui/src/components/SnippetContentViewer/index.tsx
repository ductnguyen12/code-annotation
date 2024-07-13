import { Snippet } from "../../interfaces/snippet.interface";
import SnippetBlocks from "./SnippetBlocks";
import SnippetCode from "./SnippetCode";

export default function SnippetContentViewer({
  snippet,
  defaultPLanguage,
  ...otherProps
}: {
  snippet?: Snippet,
  defaultPLanguage?: string,
  [key: string]: any,
}) {
  if ('sb3' === snippet?.pLanguage) {
    return (
      <SnippetBlocks
        snippet={snippet}
      />
    )
  }

  const {
    disableLanguageSelector,
    highlighterMaxHeight,
  } = otherProps;

  return <SnippetCode
    snippet={snippet}
    defaultPLanguage={defaultPLanguage}
    disableLanguageSelector={disableLanguageSelector}
    highlighterMaxHeight={highlighterMaxHeight}
  />
}
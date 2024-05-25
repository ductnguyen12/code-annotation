import { Snippet } from "../../interfaces/snippet.interface";
import SnippetBlocks from "./SnippetBlocks";
import SnippetCode from "./SnippetCode";

export default function SnippetViewer({
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
    showSnippetPath,
    disableLanguageSelector,
  } = otherProps;

  return <SnippetCode
    snippet={snippet}
    defaultPLanguage={defaultPLanguage}
    showSnippetPath={showSnippetPath}
    disableLanguageSelector={disableLanguageSelector}
  />
}
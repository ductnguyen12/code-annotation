import { Snippet } from "../../interfaces/snippet.interface";
import SnippetCode from "../SnippetRatingEditor/SnippetCode";
import SnippetBlocks from "./SnippetBlocks";

export default function SnippetViewer({
  snippet,
  defaultPLanguage,
  ...otherProps
}: {
  snippet?: Snippet,
  defaultPLanguage?: string,
  [key: string]: any,
}) {
  if ('sb3' === defaultPLanguage) {
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
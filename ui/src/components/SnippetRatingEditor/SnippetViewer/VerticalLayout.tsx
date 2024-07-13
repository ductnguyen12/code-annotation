import Box from "@mui/material/Box";
import React from "react";
import SnippetContentViewer from "../../SnippetContentViewer";
import SnippetQuestionButtons from "../SnippetQuestionButtons";
import SnippetQuestionList from "../SnippetQuestionList";
import SnippetRating from "../SnippetRating";
import { SnippetViewerProps } from "./interface";

export default function VerticalLayout({
  snippet,
  questions,
  selectedRater,
  defaultPLanguage,
  statistics,
  pRatings,
  invalid,
  models,
  editable,
  disableLanguageSelector,
  shouldHideQuestions,
  disableComment,
  allowNoRating,
  onFocus,
  onBlur,
  onRatingUpdate,
  onSolutionChange,
  onCreateQuestion,
  onDeleteQuestion,
  onQuestionPriorityChange,
}: SnippetViewerProps) {
  return (
    <React.Fragment>
      <SnippetContentViewer
        snippet={snippet}
        defaultPLanguage={defaultPLanguage}
        disableLanguageSelector={disableLanguageSelector}
      />
      <SnippetRating
        rating={
          // Edit my rating or view other's rating
          editable
            ? snippet?.rate
            : snippet?.rates?.find(r => selectedRater === r.rater?.id)
        }
        invalid={invalid}
        editable={editable}
        disableComment={disableComment}
        allowNoRating={allowNoRating}
        correctRating={snippet?.correctRating}
        statistics={statistics?.snippets[snippet?.id || -1]}
        pRating={pRatings?.find(rating => rating.snippetId === snippet?.id)}
        pRatingScale={models?.find(model => {
          const pRating = pRatings?.find(rating => rating.snippetId === snippet?.id);
          return pRating && model.id === pRating.modelId;
        })?.ratingScale}
        onFocus={onFocus}
        onBlur={onBlur}
        onValueChange={onRatingUpdate}
      />
      <Box className="w-4/5 mt-2">
        <SnippetQuestionList
          questions={snippet?.questions}
          rater={selectedRater}
          invalid={invalid}
          editable={editable}
          shouldHideQuestions={shouldHideQuestions}
          columns={2}
          onFocus={onFocus}
          onBlur={onBlur}
          onSolutionChange={onSolutionChange}
          onDeleteQuestion={onDeleteQuestion}
        />
      </Box>
      <Box className="w-full pt-4 px-96">
        <SnippetQuestionButtons
          questions={questions}
          onCreateQuestion={onCreateQuestion}
          onQuestionPriorityChange={onQuestionPriorityChange}
        />
      </Box>
    </React.Fragment>
  )
}
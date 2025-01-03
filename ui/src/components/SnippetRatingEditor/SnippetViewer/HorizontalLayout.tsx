import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import SnippetContentViewer from "../../SnippetContentViewer";
import SnippetQuestionButtons from "../SnippetQuestionButtons";
import SnippetQuestionList from "../SnippetQuestionList";
import SnippetRating from "../SnippetRating";
import { SnippetViewerProps } from "./interface";

export default function HorizontalLayout({
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
  onQuestionHiddenChange,
  onQuestionPriorityChange,
}: SnippetViewerProps) {
  return (
    <React.Fragment>
      <Grid
        columnSpacing={3}
        container
      >
        <Grid
          xs={12}
          md={9}
          item
        >
          <SnippetContentViewer
            snippet={snippet}
            defaultPLanguage={defaultPLanguage}
            disableLanguageSelector={disableLanguageSelector}
            highlighterMaxHeight="700px"
          />
        </Grid>
        <Grid
          xs={12}
          md={3}
          item
        >
          <Box
            className={`mt-10 ${snippet?.attentionCheck ? 'mt-28' : 'mt-16'} pr-1 overflow-auto overscroll-contain`}
            sx={{ maxHeight: '690px', minHeight: '440px' }}
          >
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
            <Typography variant="h6" gutterBottom>
              Questions
            </Typography>
            <SnippetQuestionList
              questions={questions}
              rater={selectedRater}
              invalid={invalid}
              editable={editable}
              shouldHideQuestions={shouldHideQuestions}
              onFocus={onFocus}
              onBlur={onBlur}
              onSolutionChange={onSolutionChange}
              onDeleteQuestion={onDeleteQuestion}
              onHiddenChange={onQuestionHiddenChange}
            />
          </Box>
        </Grid>
      </Grid>
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
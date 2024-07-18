import React, { useMemo } from "react";
import { Solution } from "../../../interfaces/question.interface";
import { SnippetQuestion } from "../../../interfaces/snippet.interface";
import HorizontalLayout from "./HorizontalLayout";
import { SnippetViewerProps } from "./interface";
import VerticalLayout from "./VerticalLayout";

function getLayout(layout: 'vertical' | 'horizontal' | undefined) {
  if (layout === 'horizontal')
    return HorizontalLayout
  return VerticalLayout
}

export default function SnippetViewer(props: SnippetViewerProps) {
  const {
    layout,
    snippet,
    onSolutionChange,
  } = props;

  const Layout = React.useMemo(() => getLayout(layout), [layout]);

  // ID-Index mapping before sort
  const questionIndexMap = React.useMemo(() => {
    if (!snippet?.questions)
      return {};
    const map = Object.fromEntries(snippet?.questions.map((q, index) => [q.id as number, index]));
    console.log(map);
    return map;
  }, [snippet?.questions]);

  const sortedQuestions = useMemo(() => {
    const sortByPriority = snippet?.questions?.every((q: SnippetQuestion) => !!q.priority || q.priority === 0);

    return snippet?.questions?.slice().sort((q1: SnippetQuestion, q2: SnippetQuestion) => {
      if (!sortByPriority) {
        return (q1.id as number) - (q2.id as number);
      }
      return (q1.priority as number) - (q2.priority as number);
    }) || [];
  }, [snippet?.questions]);

  const handleSolutionChange = React.useCallback((index: number, solution: Solution) => {
    onSolutionChange && onSolutionChange(questionIndexMap[sortedQuestions[index].id as number], solution);
  }, [onSolutionChange, questionIndexMap, sortedQuestions])

  return (
    <React.Fragment>
      <Layout
        {...props}
        questions={sortedQuestions}
        onSolutionChange={handleSolutionChange}
      />
    </React.Fragment>
  )
}
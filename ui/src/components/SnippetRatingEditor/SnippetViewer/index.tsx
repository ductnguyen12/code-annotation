import React, { useMemo } from "react";
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
  } = props;

  const Layout = React.useMemo(() => getLayout(layout), [layout]);

  const sortedQuestions = useMemo(() => {
    return snippet?.questions?.slice().sort((q1, q2) => {
      if ((!q1.priority && q1.priority !== 0) || (!q2.priority && q2.priority !== 0)) {
        return (q1.id as number) - (q2.id as number);
      }
      return (q1.priority as number) - (q2.priority as number);
    }) || [];
  }, [snippet?.questions]);

  return (
    <React.Fragment>
      <Layout {...props} questions={sortedQuestions} />
    </React.Fragment>
  )
}
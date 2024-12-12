import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { Snippet } from "../../interfaces/snippet.interface";
import Blocks from "../Blocks";

export default function SnippetBlocks({
  snippet,
}: {
  snippet?: Snippet,
}) {
  const projectData = useMemo(() => {
    if (!snippet?.code)
      return undefined;
    try {
      return JSON.parse(snippet.code)
    } catch (e) {
      console.log('Failed to parse scratch snippet content');
      return undefined
    }
  }, [snippet?.code]);

  return (
    <Box
      height="50%"
    >
      {snippet?.attentionCheck && (
        <Typography className="pt-4" variant="body1">
          This snippet is an attention check.
          Please give this snippet <b>{snippet?.correctRating} stars</b> to pass.
        </Typography>
      )}
      <Blocks
        projectData={projectData}
        sprite={projectData.defaultSprite}
        style={{
          margin: 'auto',
          width: '120vh',
          height: '100vh',
        }}
      />
    </Box>
  )
}
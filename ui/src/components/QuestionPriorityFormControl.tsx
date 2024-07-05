import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import { useCallback, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Question } from "../interfaces/question.interface";
import SortableList from "./SortableList";

const FORM_KEY_PRIORITY = 'priorityMap';

export default function QuestionPriorityFormControl<T extends Question>({
  questions,
}: {
  questions: T[],
}) {
  const { register, watch, setValue } = useFormContext();
  const priorityMap = watch(FORM_KEY_PRIORITY, {});

  useEffect(() => {
    register(FORM_KEY_PRIORITY, { value: Object.fromEntries(questions.map((q, i) => [q.id as number, i])) });
    setValue(FORM_KEY_PRIORITY, Object.fromEntries(questions.map((q, i) => [q.id as number, i])));
  }, [questions, register, setValue]);

  const items = useMemo(() => {
    if (!priorityMap) {
      return [];
    }

    return [...questions].sort((q1: T, q2: T) => priorityMap[q1.id as number] - priorityMap[q2.id as number])
      .map(q => ({ ...q, id: q.id as number }))
  }, [questions, priorityMap]);

  const onChange = useCallback((newItems: any) => {
    setValue(FORM_KEY_PRIORITY, Object.fromEntries(newItems.map((q: any, i: number) => [parseInt(q.id), i])));
  }, [setValue]);

  return (
    <Paper
      className="w-full"
      elevation={0}
    >
      <SortableList
        items={items}
        onChange={onChange}
        renderItem={(item, i) => (
          <SortableList.Item id={item.id}>
            <ListItemButton sx={{ cursor: 'grab' }} >
              <ListItemIcon>{i + 1}</ListItemIcon>
              <ListItemText
                primary={item.content}
                secondary={item.type}
                primaryTypographyProps={{
                  noWrap: true,
                  sx: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                }}
              />
            </ListItemButton>
          </SortableList.Item>
        )}
      />
    </Paper>
  );
}
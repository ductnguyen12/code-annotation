import { Active, DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import List from "@mui/material/List";
import React, { ReactNode } from "react";
import SortableItem from "./SortableItem";
import { SortableOverlay } from "./SortableOverlay";
import { Item } from "./interface";

export default function SortableList<T extends Item>({
  items,
  onChange,
  renderItem,
}: {
  items: T[];
  onChange(items: T[]): void;
  renderItem(item: T, index: number): ReactNode;
}) {
  const [active, setActive] = React.useState<Active | null>(null);
  const activeItem = React.useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {items.map((item, i) => (
            <React.Fragment key={item.id}>{renderItem(item, i)}</React.Fragment>
          ))}
        </List>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? renderItem(activeItem, items.findIndex((item) => item.id === activeItem.id)) : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
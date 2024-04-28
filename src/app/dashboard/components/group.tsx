import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { type TabmaItem, type TabmaKey, store } from '../../../domain/tabma'
import { Action } from './action'
import { Item } from './item'

type Props = {
  groupKey: TabmaKey
  items: TabmaItem[]
  openLink: (key: TabmaKey, item: TabmaItem) => void
  removeGroup: (key: TabmaKey) => void
}

export const Group = ({ groupKey, items, openLink, removeGroup }: Props) => {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) return
    if (event.active.id !== event.over.id) {
      const oldIndex = items.findIndex((v) => v.id === event.active.id)
      const newIndex = items.findIndex((v) => v.id === event.over?.id)
      // setItems(arrayMove(items, oldIndex, newIndex));
      console.log(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <div className="group">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <Item key={item.id} groupKey={groupKey} item={item} openLink={openLink} />
          ))}
        </SortableContext>
      </DndContext>
      <Action groupKey={groupKey} removeGroup={removeGroup} />
    </div>
  )
}

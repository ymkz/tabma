import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TabmaItem, TabmaKey } from '../../../domain/tabma'

type Props = {
  item: TabmaItem
  groupKey: TabmaKey
  openLink: (key: TabmaKey, item: TabmaItem) => void
}

export const Item = ({ item, groupKey, openLink }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault()
    openLink(groupKey, item)
  }

  return (
    <div className="item" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img src={item.favicon} width="16px" height="16px" alt="favicon" className="favicon" />
      <a href={item.url} target="_blank" rel="noreferrer" className="link" onClick={handleClick}>
        {item.title}
      </a>
    </div>
  )
}

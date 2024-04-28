import type { TabmaKey } from '../../../domain/tabma'

type Props = {
  groupKey: TabmaKey
  removeGroup: (key: TabmaKey) => void
}

export const Action = ({ groupKey, removeGroup }: Props) => {
  const handleClick = () => {
    removeGroup(groupKey)
  }

  return (
    <div className="action">
      <button type="button" className="action__open">
        すべて開く
      </button>
      <button onClick={handleClick} type="button" className="action__remove">
        すべて削除する
      </button>
    </div>
  )
}

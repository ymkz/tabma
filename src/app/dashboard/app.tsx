import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { browser } from 'wxt/browser'
import type { TabmaItem, TabmaKey, TabmaStore } from '../../domain/tabma'
import { store } from '../../domain/tabma'
import { Group } from './components/group'

export const App = () => {
  const [snapshot, setSnapshot] = useState<TabmaStore>({})

  // mount時の初期データセット
  useEffect(() => {
    store.getValue().then(setSnapshot)
  }, [])

  // mount時のwatch登録とunmount時のunwatch
  useEffect(() => {
    const unwatch = store.watch(setSnapshot)
    return () => unwatch()
  }, [])

  const openLink = (key: TabmaKey, item: TabmaItem) => {
    // バックグランドでタブを生成
    browser.tabs.create({ url: item.url, active: false })

    // 開いたページをsnapshotの状態から削除し、storeからも削除する
    const produced = produce(snapshot, (draft) => {
      if (draft[key].items) {
        draft[key].items = draft[key].items.filter(({ id }) => id !== item.id)
      }
    })

    store.setValue(produced)
  }

  const removeGroup = (key: TabmaKey) => {
    const produced = produce(snapshot, (draft) => {
      delete draft[key]
    })
    store.setValue(produced)
  }

  return (
    <>
      <div className="container">
        {Object.entries(snapshot).map(([key, value]) => (
          <Group
            key={key}
            groupKey={key}
            items={value.items}
            openLink={openLink}
            removeGroup={removeGroup}
          />
        ))}
      </div>
    </>
  )
}

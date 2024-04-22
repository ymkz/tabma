import { produce } from 'immer'
import { useEffect, useState } from 'react'
import { browser } from 'wxt/browser'
import type { TabmaItem, TabmaKey, TabmaStore } from '../../domain/tabma'
import { store } from '../../domain/tabma'

export const App = () => {
  const [snapshot, setSnapshot] = useState<TabmaStore>({})

  // mount時の初期データセット
  useEffect(() => {
    store.getValue().then((init) => setSnapshot(init))
  }, [])

  // mount時にwatch登録とunmount時のunwatch
  useEffect(() => {
    const unwatch = store.watch((next) => {
      setSnapshot(next)
    })
    return () => unwatch()
  }, [])

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    key: TabmaKey,
    item: TabmaItem,
  ) => {
    event.preventDefault() // aタグによる遷移を防止
    browser.tabs.create({ url: item.url, active: false }) // バックグランドでタブを生成
    const produced = produce(snapshot, (draft) => {
      if (draft[key].items) {
        draft[key].items = draft[key].items.filter(({ id }) => id !== item.id)
      }
    })
    store.setValue(produced)
  }

  const handleRemove = (key: TabmaKey) => {
    const filtered = Object.entries(snapshot).filter(([k]) => k !== key)
    store.setValue(Object.fromEntries(filtered))
  }

  return (
    <>
      <div className="container">
        {Object.entries(snapshot).map(([key, value]) => (
          <div key={key} className="group">
            {value.items.map((item) => (
              <div key={item.id} className="item">
                <img
                  src={item.favicon}
                  width="16px"
                  height="16px"
                  alt="favicon"
                  className="favicon"
                />
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="link"
                  onClick={(event) => handleClick(event, key, item)}
                >
                  {item.title}
                </a>
              </div>
            ))}
            <div className="action">
              <button type="button" className="action__open">
                すべて開く
              </button>
              <button onClick={() => handleRemove(key)} type="button" className="action__remove">
                すべて削除する
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

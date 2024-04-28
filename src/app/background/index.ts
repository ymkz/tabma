import { uuidv7 } from 'uuidv7'
import type { Tabs } from 'wxt/browser'
import { browser } from 'wxt/browser'
import { defineBackground } from 'wxt/sandbox'
import type { TabmaItem } from '../../domain/tabma'
import { store } from '../../domain/tabma'

export default defineBackground({
  main: () => {
    browser.runtime.onInstalled.addListener(async () => {
      browser.contextMenus.create({ id: 'saveThisTab', title: 'このページを保存する' })
      browser.contextMenus.create({ id: 'saveAllTabs', title: 'すべてのタブを保存する' })
      browser.contextMenus.create({ id: 'separator1', type: 'separator' })
      browser.contextMenus.create({ id: 'saveLeftTabs', title: '左側のタブを保存する' })
      browser.contextMenus.create({ id: 'saveRightTabs', title: '右側のタブを保存する' })
      browser.contextMenus.create({ id: 'saveExceptThisTab', title: 'このページ以外を保存する' })
      browser.contextMenus.create({ id: 'separator2', type: 'separator' })
      browser.contextMenus.create({ id: 'openDashboard', title: 'ダッシュボードを開く' })
    })

    browser.contextMenus.onClicked.addListener(async (info, tab) => {
      if (!tab) throw new Error('NOT_FOUND_TAB')

      const currentItems = await store.getValue()

      switch (info.menuItemId) {
        case 'saveThisTab': {
          const item = toSaveItem(tab)
          const latestKey = Object.keys(currentItems).toSorted().at(0)
          if (latestKey) {
            const latestGroup = currentItems[latestKey]
            await store.setValue({
              ...currentItems,
              [latestKey]: { items: [item, ...latestGroup.items] },
            })
          } else {
            const key = uuidv7()
            await store.setValue({ [key]: { items: [item] } })
          }
          break
        }
        case 'saveAllTabs': {
          const tabs = await browser.tabs.query({ pinned: false, currentWindow: true })
          const items = tabs.filter(byHttpPage).map(toSaveItem)
          const key = uuidv7()
          await store.setValue({ ...currentItems, [key]: { items } })
          break
        }
        case 'saveLeftTabs': {
          const tabs = await browser.tabs.query({ pinned: false, currentWindow: true })
          const items = tabs
            .filter(byHttpPage)
            .splice(0, tab.index - 1)
            .map(toSaveItem)
          const key = uuidv7()
          await store.setValue({ ...currentItems, [key]: { items } })
          break
        }
        case 'saveRightTabs': {
          const tabs = await browser.tabs.query({ pinned: false, currentWindow: true })
          const items = tabs
            .filter(byHttpPage)
            .splice(tab.index - 1)
            .map(toSaveItem)
          const key = uuidv7()
          await store.setValue({ ...currentItems, [key]: { items } })
          break
        }
        case 'saveExceptThisTab': {
          const tabs = await browser.tabs.query({ pinned: false, currentWindow: true })
          const items = tabs
            .filter(byHttpPage)
            .filter((_, i) => i !== tab.index - 1)
            .map(toSaveItem)
          const key = uuidv7()
          await store.setValue({ ...currentItems, [key]: { items } })
          break
        }
        case 'openDashboard': {
          browser.tabs.create({ url: browser.runtime.getURL('/dashboard.html') })
          break
        }
      }
    })
  },
})

const byHttpPage = (tab: Tabs.Tab) => {
  return tab.url?.startsWith('http')
}

const toSaveItem = (tab?: Tabs.Tab): TabmaItem => {
  if (!tab) throw new Error('NOT_FOUND_TAB')
  if (!tab.id || !tab.url || !tab.title || !tab.favIconUrl) throw new Error('NOT_FOUND_TAB_INFO')
  return { id: tab.id, url: tab.url, title: tab.title, favicon: tab.favIconUrl }
}

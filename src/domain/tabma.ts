import type { uuidv7 } from 'uuidv7'
import { storage } from 'wxt/storage'

export type TabmaKey = ReturnType<typeof uuidv7>
export type TabmaItem = { id: number; url: string; title: string; favicon: string }
export type TabmaStore = Record<TabmaKey, { items: TabmaItem[] }>

export const store = storage.defineItem<TabmaStore>('local:tabma', {
  defaultValue: {},
})

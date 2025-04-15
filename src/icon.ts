import { getActiveIcon, getMutedIcon, getUnmutedIcon } from './icons'

let prevIconMap = new Map<number, string>()
function setIcon(tabId: number, iconPath: string) {
  if (!iconPath) {
    return console.warn('Icon path is undefined')
  }

  if (iconPath === prevIconMap.get(tabId)) {
    return console.log('Icon is already set to', iconPath)
  }

  prevIconMap.set(tabId, iconPath)
  chrome.action.setIcon({ path: iconPath, tabId })
  console.warn('📸 Icon set to', iconPath)
}

export function disposeTabInfo(tabId: number) {
  console.log('🚮 Disposing tab info', tabId)
  prevIconMap.delete(tabId)
}

export async function updateTabIcon(tab: chrome.tabs.Tab) {
  const tabId = tab.id
  if (!tabId) return console.error('Tab ID is undefined')

  const isMuted = tab.mutedInfo?.muted
  if (isMuted === undefined) {
    return console.warn('Tab muted state is undefined')
  }

  console.log('?*', 'Tab muted', { muted: isMuted })
  if (isMuted) return setIcon(tabId, await getMutedIcon())

  const isPlaying = tab.audible
  if (isPlaying === undefined) {
    return console.warn('Tab audible state is undefined')
  }

  console.log('?*', 'Tab playing', { audible: isPlaying })
  setIcon(tabId, isPlaying ? await getActiveIcon() : await getUnmutedIcon())
}

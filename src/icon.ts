import { getActiveIcon, getMutedIcon, getUnmutedIcon } from './icons'

export async function updateTabIcon(tab: chrome.tabs.Tab, isMuted?: boolean) {
  if (isMuted === undefined) {
    return console.warn('Tab muted state is undefined')
  }

  const tabId = tab.id
  if (!tabId) return console.error('Tab ID is undefined')

  console.log('>', 'Tab muted icon', {
    tabId,
    newMuted: isMuted,
    audible: tab.audible,
    currentMuted: tab.mutedInfo?.muted,
  })

  if (isMuted) {
    return chrome.action.setIcon({ path: await getMutedIcon(), tabId })
  }

  /*
   * If the tab isn't muted, update the icon to the unmuted icon or audible icon
   */
  updateTabAudibleIcon(tabId, tab.audible)
}

export async function updateTabAudibleIcon(tabId: number, isPlaying?: boolean) {
  if (isPlaying === undefined) {
    return console.warn('Tab audible state is undefined')
  }

  console.log('>', 'Tab audible icon', { isPlaying, tabId })

  const icons = await (isPlaying ? getActiveIcon() : getUnmutedIcon())
  chrome.action.setIcon({ path: icons, tabId })
}

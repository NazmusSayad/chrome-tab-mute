import { getMutedIcon, getActiveIcon, getUnmutedIcon } from './icons'

export function updateMuteState(tab: chrome.tabs.Tab) {
  const shouldMute = !tab.mutedInfo?.muted
  chrome.tabs.update(tab.id, { muted: shouldMute })
  updateTabIcon(tab, shouldMute)
}

export async function updateTabIcon(tab: chrome.tabs.Tab, shouldMute: boolean) {
  const tabId = tab.id

  if (!shouldMute) {
    return updateTabIconOnAudio(tab.audible, tabId)
  }

  chrome.action.setIcon({
    path: await getMutedIcon(),
    tabId,
  })
}

export async function updateTabIconOnAudio(
  isActive: boolean | undefined,
  tabId: number
) {
  const icons = await (isActive ? getActiveIcon() : getUnmutedIcon())
  chrome.action.setIcon({ path: icons, tabId })
}

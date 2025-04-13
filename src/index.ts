import { execOffscreenDocument } from './offscreen-doc'
import { updateTabIconOnAudio, updateMuteState, updateTabIcon } from './ui'

execOffscreenDocument()

chrome.runtime.onMessage.addListener(
  (message: { type: string; dark: boolean }) => {
    if (message.type === 'darkTheme') {
      chrome.storage.session.set({ isDarkTheme: message.dark })
    }
  }
)

chrome.tabs.onActivated.addListener(({ tabId }: { tabId: number }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.mutedInfo?.muted) return

    updateTabIconOnAudio(tab.audible, tab.id)
  })
})

chrome.tabs.onUpdated.addListener(
  (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    if ('status' in changeInfo) {
      return updateTabIcon(tab, tab.mutedInfo?.muted ?? false)
    }

    if (
      (tab.mutedInfo?.muted && !('mutedInfo' in changeInfo)) ||
      ('mutedInfo' in changeInfo && changeInfo.mutedInfo?.muted)
    ) {
      return
    }

    if ('audible' in changeInfo) {
      updateTabIconOnAudio(changeInfo.audible, tabId)
    }
  }
)

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  updateMuteState(tab)
})

import { handleToggleMuteCurrentTab } from './commands'
import { execOffscreenDocument } from './offscreen-doc'
import { updateMuteState, updateTabIcon, updateTabIconOnAudio } from './ui'

execOffscreenDocument()

chrome.runtime.onMessage.addListener(
  (message: { type: string; dark: boolean }) => {
    console.log('Message received', message)

    if (message.type === 'darkTheme') {
      chrome.storage.session.set({ isDarkTheme: message.dark })
    }
  }
)

chrome.tabs.onActivated.addListener(({ tabId }: { tabId: number }) => {
  chrome.tabs.get(tabId, (tab) => {
    console.log('Tab activated', tabId, tab)

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
    console.log('Tab updated', tabId, changeInfo, tab)

    if ('status' in changeInfo) {
      console.log('Tab status changed', changeInfo.status)
      return updateTabIcon(tab, tab.mutedInfo?.muted ?? false)
    }

    if (
      (tab.mutedInfo?.muted && !('mutedInfo' in changeInfo)) ||
      ('mutedInfo' in changeInfo && changeInfo.mutedInfo?.muted)
    ) {
      return console.log('Tab muted', changeInfo.mutedInfo?.muted)
    }

    if ('audible' in changeInfo) {
      console.log('Tab audible changed', changeInfo.audible)
      updateTabIconOnAudio(changeInfo.audible, tabId)
    }
  }
)

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-mute-current-tab') {
    console.log('Trigger toggle mute current tab command')
    handleToggleMuteCurrentTab()
  }
})

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  console.log('Action clicked', tab)
  updateMuteState(tab)
})

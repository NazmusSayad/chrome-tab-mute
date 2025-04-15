import { toggleCurrentTabMute } from './commands'
import { updateTabAudibleIcon, updateTabIcon } from './icon'
import { execOffscreenDocument } from './offscreen-doc'

execOffscreenDocument()

chrome.runtime.onMessage.addListener(
  (message: { type: string; dark: boolean }) => {
    try {
      if (message.type === 'darkTheme') {
        chrome.storage.session.set({ isDarkTheme: message.dark })
      }
    } catch (err) {
      console.log('Error in message listener', err)
    }
  }
)

chrome.tabs.onActivated.addListener(({ tabId }: { tabId: number }) => {
  chrome.tabs.get(tabId, async (tab) => {
    try {
      const innerTabId = tab.id
      if (!innerTabId) {
        return console.error('Tab ID is undefined')
      }

      if (tab.mutedInfo?.muted) return

      await updateTabAudibleIcon(innerTabId, tab.audible)
    } catch (err) {
      console.error('Error in tab activated listener', err)
    }
  })
})

chrome.tabs.onUpdated.addListener(
  async (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    try {
      console.log('# Tab Update', changeInfo, '\n\n')

      if ('status' in changeInfo) {
        return await updateTabIcon(tab, tab.mutedInfo?.muted)
      }

      /*
       * Check if the tab is muted or unmuted
       * If the tab is muted, update the icon to the muted icon
       * If the tab is unmuted, update the icon to the unmuted icon
       */
      if (
        'mutedInfo' in changeInfo &&
        changeInfo?.mutedInfo != null &&
        'muted' in changeInfo?.mutedInfo &&
        changeInfo?.mutedInfo?.muted != null
      ) {
        return await updateTabIcon(tab, tab.mutedInfo?.muted)
      }

      /*
       * Check if the tab is audible or not
       * If the tab is audible, update the icon to the audible icon else the default icon
       * If the tab is muted, do not update the icon
       */
      if ('audible' in changeInfo && !tab.mutedInfo?.muted) {
        await updateTabAudibleIcon(tabId, tab.audible)
      }
    } catch (err) {
      console.error('Error in tab update listener', err)
    }
  }
)

chrome.commands.onCommand.addListener(async (command) => {
  try {
    if (command === 'toggle-mute-current-tab') {
      console.log('-', 'Trigger toggle mute current tab command')
      await toggleCurrentTabMute()
    }
  } catch (err) {
    console.error('Error in command listener', err)
  }
})

chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  try {
    console.log('-', 'Action clicked', tab)
    await toggleCurrentTabMute(tab)
  } catch (err) {
    console.error('Error in action clicked listener', err)
  }
})

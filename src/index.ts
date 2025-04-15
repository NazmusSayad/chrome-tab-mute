import { toggleTabMute } from './commands'
import { disposeTabInfo, updateTabIcon } from './icon'
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

chrome.tabs.onActivated.addListener(async ({ tabId }: { tabId: number }) => {
  try {
    disposeTabInfo(tabId)

    const tab = await chrome.tabs.get(tabId)
    if (!tab) return console.error('Tab is undefined')

    await updateTabIcon(tab)
  } catch (err) {
    console.error('Error in tab activated listener', err)
  }
})

chrome.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
  try {
    console.log('# Tab Update', changeInfo, '\n\n')

    if ('status' in changeInfo) {
      if (tab.id && changeInfo.status === 'loading') {
        disposeTabInfo(tab.id)
      }

      return await updateTabIcon(tab)
    }

    /*
     * Check if the tab is muted or unmuted
     * If the tab is muted, update the icon to the muted icon
     * If the tab is unmuted, update the icon to the unmuted icon
     */
    if (
      'mutedInfo' in changeInfo &&
      changeInfo?.mutedInfo !== undefined &&
      'muted' in changeInfo?.mutedInfo &&
      changeInfo?.mutedInfo?.muted !== undefined
    ) {
      return await updateTabIcon(tab)
    }

    /*
     * Check if the tab is audible or not
     * If the tab is audible, update the icon to the audible icon else the default icon
     * If the tab is muted, do not update the icon
     */
    if ('audible' in changeInfo && !tab.mutedInfo?.muted) {
      await updateTabIcon(tab)
    }
  } catch (err) {
    console.error('Error in tab update listener', err)
  }
})

chrome.tabs.onRemoved.addListener((tabId) => {
  try {
    console.log('Tab removed', tabId)
    disposeTabInfo(tabId)
  } catch (err) {
    console.error('Error in tab removed listener', err)
  }
})

chrome.commands.onCommand.addListener(async (command) => {
  try {
    if (command === 'toggle-mute-current-tab') {
      console.log('-', 'Trigger toggle mute current tab command')
      await toggleTabMute()
    }
  } catch (err) {
    console.error('Error in command listener', err)
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  try {
    console.log('-', 'Action clicked', tab)
    await toggleTabMute(tab)
  } catch (err) {
    console.error('Error in action clicked listener', err)
  }
})

export async function toggleCurrentTabMute(targetTab?: chrome.tabs.Tab) {
  const [tab] = targetTab
    ? [targetTab]
    : await chrome.tabs.query({ currentWindow: true, active: true })

  if (!tab) return console.warn('No current tab found')

  const tabId = tab.id
  if (!tabId) return console.error('Tab ID is undefined')

  console.warn('*', 'Toggle mute current tab', {
    currentMuted: tab.mutedInfo?.muted,
    newMuted: !tab.mutedInfo?.muted,
    audible: tab.audible,
  })

  if (tab.url?.startsWith('chrome://')) {
    console.warn('Muting system tab', tab.url)
  }

  chrome.tabs.update(tabId, { muted: !tab.mutedInfo?.muted })
}

import { updateMuteState } from './ui'

export async function handleToggleMuteCurrentTab() {
  const [currentTab] = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  })

  if (!currentTab) return console.warn('No current tab found')
  updateMuteState(currentTab)
}

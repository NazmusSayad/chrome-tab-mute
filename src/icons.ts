interface ExtensionIcons {
  muted: string
  active: string
  unmuted: string
}

function getIconSet(isDarkTheme: boolean): ExtensionIcons {
  const mutedIconFilename = 'mute-red'
  const activeIconFilename = 'active'
  const unmutedIconFilename = isDarkTheme ? 'normal-white' : 'normal-black'

  return {
    muted: chrome.runtime.getURL(`images/${mutedIconFilename}-128.png`),
    active: chrome.runtime.getURL(`images/${activeIconFilename}-128.png`),
    unmuted: chrome.runtime.getURL(`images/${unmutedIconFilename}-128.png`),
  }
}

export async function getMutedIcon() {
  const result = await chrome.storage.session.get('isDarkTheme')
  return getIconSet(result.isDarkTheme).muted
}

export async function getUnmutedIcon() {
  const result = await chrome.storage.session.get('isDarkTheme')
  return getIconSet(result.isDarkTheme).unmuted
}

export async function getActiveIcon() {
  const result = await chrome.storage.session.get('isDarkTheme')
  return getIconSet(result.isDarkTheme).active
}

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

async function isDarkTheme() {
  const result = await chrome.storage.session.get('isDarkTheme')
  return Boolean(result?.isDarkTheme)
}

export async function getMutedIcon() {
  return getIconSet(await isDarkTheme()).muted
}

export async function getUnmutedIcon() {
  return getIconSet(await isDarkTheme()).unmuted
}

export async function getActiveIcon() {
  return getIconSet(await isDarkTheme()).active
}

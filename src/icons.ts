interface ExtensionIcons {
  muted: string
  active: string
  unmuted: string
}

function EXTENSION_ICONS(isDarkTheme: boolean): ExtensionIcons {
  const mutedIconFilename = 'mute-red'
  const activeIconFilename = 'active'
  const unmutedIconFilename = isDarkTheme ? 'normal-white' : 'normal-black'

  return {
    muted: chrome.runtime.getURL(`dist/images/${mutedIconFilename}-128.png`),
    active: chrome.runtime.getURL(`dist/images/${activeIconFilename}-128.png`),
    unmuted: chrome.runtime.getURL(
      `dist/images/${unmutedIconFilename}-128.png`
    ),
  }
}

export async function MUTED_ICON() {
  const result = await chrome.storage.session.get('isDarkTheme')
  return EXTENSION_ICONS(result.isDarkTheme).muted
}

export async function UNMUTED_ICON() {
  const result = await chrome.storage.session.get('isDarkTheme')
  return EXTENSION_ICONS(result.isDarkTheme).unmuted
}

export async function ACTIVE_ICON() {
  const result = await chrome.storage.session.get('isDarkTheme')
  return EXTENSION_ICONS(result.isDarkTheme).active
}

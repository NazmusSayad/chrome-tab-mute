const darkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches

chrome.runtime.sendMessage({
  type: 'darkTheme',
  dark: darkTheme,
})

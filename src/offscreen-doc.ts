export async function execOffscreenDocument() {
  const exists = await chrome.offscreen.hasDocument()
  if (!exists) {
    await chrome.offscreen.createDocument({
      url: chrome.runtime.getURL('offscreen.html'),
      justification: 'Get the theme (css media) of the current page',
      reasons: ['MATCH_MEDIA'],
    })
  }
}

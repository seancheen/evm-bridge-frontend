export default async function clipboardCopy(text) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    }
  } catch (err) {
    console.warn('Copy error', err, 'fallback to input copy')
  }

  if (document.execCommand('copy') === false && !window.isIOS) {
    throw new Error('Copy failed')
  } else {
    return fallbackCopyTextToClipboard(text)
  }
}

function fallbackCopyTextToClipboard(text) {
  // Put the text to copy into a <span>
  const span = document.createElement('span')
  span.textContent = text

  // Preserve consecutive spaces and newlines
  span.style.whiteSpace = 'pre'

  // Add the <span> to the page
  document.body.appendChild(span)

  // Make a selection object representing the range of text selected by the user
  const selection = window.getSelection()
  const range = window.document.createRange()
  selection.removeAllRanges()
  range.selectNode(span)
  selection.addRange(range)

  // Copy text to the clipboard
  let success = false
  try {
    success = window.document.execCommand('copy')
  } catch (err) {
    console.log('error', err)
  }

  // Cleanup
  selection.removeAllRanges()
  window.document.body.removeChild(span)

  return success
    ? Promise.resolve()
    : Promise.reject(new DOMException('The request is not allowed', 'NotAllowedError'))
}

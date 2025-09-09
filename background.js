// Background script for handling extension lifecycle and downloads
const chrome = window.chrome // Declare the chrome variable

chrome.runtime.onInstalled.addListener(() => {
  console.log("WhatsApp Contacts Exporter installed")
})

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadFile") {
    chrome.downloads.download(
      {
        url: request.url,
        filename: request.filename,
        saveAs: true,
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message })
        } else {
          sendResponse({ success: true, downloadId })
        }
      },
    )
    return true // Keep message channel open for async response
  }
})

// Declare the chrome variable before using it
const chrome = window.chrome

class WhatsAppContactsExtractor {
  constructor() {
    this.contacts = []
    this.groupName = ""
    this.isGroupOpen = false
    this.selectors = {
      conversationHeader: [
        '[data-testid="conversation-header"]',
        'header[data-testid="conversation-header"]',
        '.copyable-text[data-testid="conversation-title"]',
        'div[role="banner"]',
        "header",
      ],
      conversationTitle: [
        '[data-testid="conversation-title"]',
        '.copyable-text[data-testid="conversation-title"]',
        "span[title]",
        "div[title]",
      ],
      groupIndicators: [
        '[data-testid="group-info-drawer"]',
        'span[title*="participants"]',
        'span[title*="members"]',
        'div[title*="participants"]',
        'div[title*="members"]',
      ],
      groupInfoDrawer: ['[data-testid="group-info-drawer"]', '[data-testid="drawer-right"]', ".drawer-section-body"],
      participantsSection: [
        '[data-testid="group-info-participants"]',
        ".group-info-participants",
        '[data-testid="section-participants"]',
      ],
      participantCells: [
        '[data-testid="cell-frame-container"]',
        ".cell-frame-container",
        '[data-testid="participant-cell"]',
      ],
      cellTitle: ['[data-testid="cell-frame-title"]', ".cell-frame-title", "span[title]"],
      cellSecondary: ['[data-testid="cell-frame-secondary"]', ".cell-frame-secondary", ".participant-secondary"],
      adminLabel: ['[data-testid="admin-label"]', ".admin-label", '[title*="admin"]'],
      closeButton: [
        '[data-testid="drawer-right"] [data-testid="x"]',
        '[data-testid="x"]',
        '.drawer-header button[aria-label*="Close"]',
      ],
    }

    console.log("[v0] WhatsApp Contacts Extractor initializing...")
    this.init()
  }

  init() {
    console.log("[v0] Starting initialization...")
    this.checkGroupStatus()
    this.setupMessageListener()
    console.log("[v0] Initialization complete. Group status:", this.isGroupOpen, "Group name:", this.groupName)
  }

  checkGroupStatus() {
    console.log("[v0] Checking group status...")

    this.isGroupOpen = false
    this.groupName = ""

    // Method 1: Check conversation header
    const groupHeader = this.findElement(this.selectors.conversationHeader)
    console.log("[v0] Found header element:", !!groupHeader)

    if (groupHeader) {
      const titleElement = this.findElement(this.selectors.conversationTitle, groupHeader)
      console.log("[v0] Found title element:", !!titleElement)

      if (titleElement) {
        this.groupName = titleElement.textContent.trim()
        console.log("[v0] Extracted group name:", this.groupName)

        // Method 2: Check for participant count in header area
        const participantCount = this.getParticipantCountFromHeader(groupHeader)
        console.log("[v0] Participant count from header:", participantCount)

        // Method 3: Look for group indicators anywhere in the header area
        const hasGroupIndicator = this.hasGroupIndicators(groupHeader)
        console.log("[v0] Has group indicators:", hasGroupIndicator)

        if (this.groupName && (participantCount > 1 || hasGroupIndicator || this.isLikelyGroupName(this.groupName))) {
          this.isGroupOpen = true
          console.log("[v0] Group detected successfully!")
        }
      }
    }

    if (!this.isGroupOpen) {
      const chatArea =
        document.querySelector('[data-testid="conversation-panel-body"]') ||
        document.querySelector('[data-testid="main"]') ||
        document.querySelector('div[role="main"]')

      if (chatArea && this.groupName) {
        console.log("[v0] Fallback: Found chat area, assuming group if name exists")
        this.isGroupOpen = true
      }
    }

    console.log("[v0] Final group status - Open:", this.isGroupOpen, "Name:", this.groupName)
  }

  hasGroupIndicators(headerElement) {
    // Look for text that indicates this is a group
    const textContent = headerElement.textContent.toLowerCase()
    const groupKeywords = ["participants", "members", "group", "admin"]

    for (const keyword of groupKeywords) {
      if (textContent.includes(keyword)) {
        return true
      }
    }

    // Look for specific group indicator elements
    for (const selector of this.selectors.groupIndicators) {
      if (headerElement.querySelector(selector) || document.querySelector(selector)) {
        return true
      }
    }

    return false
  }

  isLikelyGroupName(name) {
    if (!name || name.length < 2) return false

    // Individual contact names are usually shorter and don't contain certain patterns
    const groupPatterns = [
      /group/i,
      /team/i,
      /family/i,
      /friends/i,
      /class/i,
      /work/i,
      /project/i,
      /\d{4}/, // Years
      
 {6}/[📱💬🏠👥]/u, // Common group emojis
    ]

    return groupPatterns.some((pattern) => pattern.test(name)) || name.length > 20
  }

  getParticipantCountFromHeader(headerElement) {
    const subtitleElements = headerElement.querySelectorAll("span, div")
    for (const element of subtitleElements) {
      const text = element.textContent.trim()
      const patterns = [/(\d+)\s+participants?/i, /(\d+)\s+members?/i, /(\d+)\s+people/i, /(\d+)\s+contacts?/i]

      for (const pattern of patterns) {
        const match = text.match(pattern)
        if (match) {
          return Number.parseInt(match[1])
        }
      }
    }
    return null
  }

  findElement(selectors, parent = document) {
    for (const selector of selectors) {
      const element = parent.querySelector(selector)
      if (element) return element
    }
    return null
  }

  findElements(selectors, parent = document) {
    for (const selector of selectors) {
      const elements = parent.querySelectorAll(selector)
      if (elements.length > 0) return elements
    }
    return []
  }

  setupMessageListener() {
    console.log("[v0] Setting up message listener...")
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("[v0] Received message:", request.action)

      switch (request.action) {
        case "checkStatus":
          this.checkGroupStatus()
          const response = {
            isGroupOpen: this.isGroupOpen,
            groupName: this.groupName,
          }
          console.log("[v0] Sending status response:", response)
          sendResponse(response)
          break

        case "exportContacts":
          console.log("[v0] Starting export with options:", request.options)
          this.exportContacts(request.options)
            .then((result) => {
              console.log("[v0] Export completed:", result)
              sendResponse(result)
            })
            .catch((error) => {
              console.error("[v0] Export failed:", error)
              sendResponse({ success: false, error: error.message })
            })
          return true // Keep message channel open for async response

        case "quickScan":
          console.log("[v0] Starting quick scan...")
          this.quickScanContacts()
            .then((result) => {
              console.log("[v0] Quick scan completed:", result)
              sendResponse(result)
            })
            .catch((error) => {
              console.error("[v0] Quick scan failed:", error)
              sendResponse({ success: false, error: error.message })
            })
          return true
      }
    })
  }

  async exportContacts(options = {}) {
    try {
      // First, we need to open the group info panel
      await this.openGroupInfo()

      // Wait for the participants list to load
      await this.waitForParticipants()

      // Extract contacts
      const contacts = await this.extractContactsFromPanel(options.includeAdminsOnly)

      // Close the group info panel
      this.closeGroupInfo()

      if (contacts.length === 0) {
        throw new Error("No contacts found")
      }

      // Generate file content
      const { data, filename } = this.generateFileContent(contacts, options.format || "csv")

      return {
        success: true,
        data,
        filename,
        count: contacts.length,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async quickScanContacts() {
    try {
      await this.openGroupInfo()
      await this.waitForParticipants()

      const contacts = await this.extractContactsFromPanel(false) // Get all contacts

      this.closeGroupInfo()

      return {
        success: true,
        contacts: contacts,
        count: contacts.length,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async openGroupInfo() {
    const headerButton = this.findElement(this.selectors.conversationHeader)
    if (!headerButton) {
      throw new Error("Group header not found")
    }

    const clickTargets = [headerButton, headerButton.querySelector("div"), headerButton.querySelector("span")].filter(
      Boolean,
    )

    let groupInfoOpened = false
    for (const target of clickTargets) {
      target.click()

      try {
        await this.waitForElement(this.selectors.groupInfoDrawer, 2000)
        groupInfoOpened = true
        break
      } catch (error) {
        console.warn("Failed to open group info with target:", target)
      }
    }

    if (!groupInfoOpened) {
      throw new Error("Could not open group info panel")
    }
  }

  async waitForParticipants() {
    try {
      await this.waitForElement(this.selectors.participantsSection, 5000)
    } catch (error) {
      const participantCells = this.findElements(this.selectors.participantCells)
      if (participantCells.length === 0) {
        throw new Error("No participants found in group info")
      }
    }

    const participantsContainer = this.findElement(this.selectors.participantsSection)
    if (participantsContainer) {
      await this.scrollToLoadAll(participantsContainer)
    }
  }

  async scrollToLoadAll(container) {
    let lastHeight = 0
    let currentHeight = container.scrollHeight
    let stableCount = 0
    const maxAttempts = 20

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      lastHeight = currentHeight
      container.scrollTop = container.scrollHeight

      await this.sleep(800)

      currentHeight = container.scrollHeight

      if (lastHeight === currentHeight) {
        stableCount++
        if (stableCount >= 3) break
      } else {
        stableCount = 0
      }
    }
  }

  async extractContactsFromPanel(includeAdminsOnly = false) {
    const contacts = []
    const participantElements = this.findElements(this.selectors.participantCells)

    if (participantElements.length === 0) {
      throw new Error("No participant elements found")
    }

    for (const element of participantElements) {
      try {
        const contact = this.extractContactInfo(element, includeAdminsOnly)
        if (contact) {
          contacts.push(contact)
        }
      } catch (error) {
        console.warn("Failed to extract contact:", error)
      }
    }

    return contacts
  }

  extractContactInfo(element, includeAdminsOnly) {
    // Extract name with fallback selectors
    const nameElement = this.findElement(this.selectors.cellTitle, element)
    const name = nameElement ? nameElement.textContent.trim() : "Unknown"

    const subtitleElement = this.findElement(this.selectors.cellSecondary, element)
    let phoneNumber = ""
    let status = ""

    if (subtitleElement) {
      const subtitleText = subtitleElement.textContent.trim()

      const phoneRegex = /^(\+?[\d\s\-$$$$.]{7,}|\+\d{1,4}[\s-]?\d{4,})$/
      if (phoneRegex.test(subtitleText)) {
        phoneNumber = this.cleanPhoneNumber(subtitleText)
      } else {
        status = subtitleText

        const phoneMatch = subtitleText.match(/(\+?[\d\s\-$$$$.]{10,})/g)
        if (phoneMatch) {
          phoneNumber = this.cleanPhoneNumber(phoneMatch[0])
          status = subtitleText.replace(phoneMatch[0], "").trim()
        }
      }
    }

    const isAdmin = this.findElement(this.selectors.adminLabel, element) !== null

    // Filter by admin status if requested
    if (includeAdminsOnly && !isAdmin) {
      return null
    }

    if (!name || (name === "Unknown" && !phoneNumber)) {
      return null
    }

    return {
      name,
      phoneNumber,
      status,
      isAdmin,
    }
  }

  cleanPhoneNumber(phone) {
    if (!phone) return ""

    // Remove extra spaces and formatting, but keep the + for international numbers
    return phone.replace(/[\s\-$$$$.]/g, "").replace(/^\+/, "+")
  }

  closeGroupInfo() {
    const closeButton = this.findElement(this.selectors.closeButton)
    if (closeButton) {
      closeButton.click()
    } else {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    }
  }

  generateFileContent(contacts, format) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const groupNameSafe = this.groupName.replace(/[^a-zA-Z0-9]/g, "_")

    if (format === "csv") {
      const csvContent = this.generateCSV(contacts)
      return {
        data: csvContent,
        filename: `whatsapp_contacts_${groupNameSafe}_${timestamp}.csv`,
      }
    } else {
      const txtContent = this.generateTXT(contacts)
      return {
        data: txtContent,
        filename: `whatsapp_contacts_${groupNameSafe}_${timestamp}.txt`,
      }
    }
  }

  generateCSV(contacts) {
    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = "\uFEFF"

    // Enhanced headers with more descriptive names
    const headers = [
      "Full Name",
      "Phone Number",
      "Status Message",
      "Admin Role",
      "Contact Type",
      "Export Date",
      "Group Name",
    ]

    // Create metadata row
    const metadata = {
      exportDate: new Date().toLocaleString(),
      groupName: this.groupName,
      totalContacts: contacts.length,
      exportedBy: "WhatsApp Contacts Exporter",
    }

    const csvRows = []

    // Add metadata as comments (Excel will ignore these)
    csvRows.push(`# WhatsApp Group: ${metadata.groupName}`)
    csvRows.push(`# Export Date: ${metadata.exportDate}`)
    csvRows.push(`# Total Contacts: ${metadata.totalContacts}`)
    csvRows.push(`# Exported By: ${metadata.exportedBy}`)
    csvRows.push("") // Empty line for separation

    // Add headers
    csvRows.push(headers.join(","))

    // Sort contacts: admins first, then alphabetically by name
    const sortedContacts = [...contacts].sort((a, b) => {
      if (a.isAdmin && !b.isAdmin) return -1
      if (!a.isAdmin && b.isAdmin) return 1
      return a.name.localeCompare(b.name)
    })

    // Add contact data
    sortedContacts.forEach((contact) => {
      const contactType = this.determineContactType(contact)

      const row = [
        this.escapeCsvField(contact.name),
        this.formatPhoneNumber(contact.phoneNumber),
        this.escapeCsvField(contact.status),
        contact.isAdmin ? "Admin" : "Member",
        contactType,
        metadata.exportDate,
        this.escapeCsvField(metadata.groupName),
      ]
      csvRows.push(row.join(","))
    })

    return BOM + csvRows.join("\n")
  }

  determineContactType(contact) {
    if (!contact.phoneNumber && !contact.status) {
      return "Name Only"
    } else if (contact.phoneNumber && contact.status) {
      return "Complete"
    } else if (contact.phoneNumber) {
      return "With Phone"
    } else if (contact.status) {
      return "With Status"
    }
    return "Basic"
  }

  formatPhoneNumber(phone) {
    if (!phone) return ""

    // Clean the phone number first
    const cleaned = phone.replace(/[\s\-$$$$.]/g, "")

    // If it's a valid international number, format it nicely
    if (cleaned.startsWith("+")) {
      // Try to format international numbers
      if (cleaned.length >= 10) {
        const countryCode = cleaned.substring(0, cleaned.length - 10)
        const number = cleaned.substring(cleaned.length - 10)

        // Format as: +CC (XXX) XXX-XXXX for 10-digit numbers
        if (number.length === 10) {
          return `${countryCode} (${number.substring(0, 3)}) ${number.substring(3, 6)}-${number.substring(6)}`
        }
      }
      return cleaned // Return as-is if can't format
    }

    // Format domestic numbers
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`
    }

    return cleaned
  }

  generateTXT(contacts) {
    const exportDate = new Date().toLocaleString()
    const adminCount = contacts.filter((c) => c.isAdmin).length
    const memberCount = contacts.length - adminCount
    const contactsWithPhone = contacts.filter((c) => c.phoneNumber).length
    const contactsWithStatus = contacts.filter((c) => c.status).length

    let txtContent = `WhatsApp Group Contacts Export\n`
    txtContent += `${"=".repeat(40)}\n\n`

    txtContent += `Group Name: ${this.groupName}\n`
    txtContent += `Export Date: ${exportDate}\n`
    txtContent += `Total Contacts: ${contacts.length}\n`
    txtContent += `Administrators: ${adminCount}\n`
    txtContent += `Members: ${memberCount}\n`
    txtContent += `Contacts with Phone: ${contactsWithPhone}\n`
    txtContent += `Contacts with Status: ${contactsWithStatus}\n\n`

    // Sort contacts: admins first, then alphabetically
    const sortedContacts = [...contacts].sort((a, b) => {
      if (a.isAdmin && !b.isAdmin) return -1
      if (!a.isAdmin && b.isAdmin) return 1
      return a.name.localeCompare(b.name)
    })

    // Group by admin status
    const admins = sortedContacts.filter((c) => c.isAdmin)
    const members = sortedContacts.filter((c) => !c.isAdmin)

    if (admins.length > 0) {
      txtContent += `ADMINISTRATORS (${admins.length})\n`
      txtContent += `${"-".repeat(20)}\n`

      admins.forEach((contact, index) => {
        txtContent += `${index + 1}. ${contact.name}\n`
        if (contact.phoneNumber) {
          txtContent += `   📞 ${this.formatPhoneNumber(contact.phoneNumber)}\n`
        }
        if (contact.status) {
          txtContent += `   💬 ${contact.status}\n`
        }
        txtContent += "\n"
      })
    }

    if (members.length > 0) {
      txtContent += `MEMBERS (${members.length})\n`
      txtContent += `${"-".repeat(20)}\n`

      members.forEach((contact, index) => {
        txtContent += `${index + 1}. ${contact.name}\n`
        if (contact.phoneNumber) {
          txtContent += `   📞 ${this.formatPhoneNumber(contact.phoneNumber)}\n`
        }
        if (contact.status) {
          txtContent += `   💬 ${contact.status}\n`
        }
        txtContent += "\n"
      })
    }

    txtContent += `\n${"=".repeat(40)}\n`
    txtContent += `Generated by WhatsApp Contacts Exporter\n`
    txtContent += `Export completed at ${exportDate}\n`

    return txtContent
  }

  escapeCsvField(field) {
    if (!field) return '""' // Return empty quoted string for null/undefined

    const stringField = String(field).trim()

    // Always quote fields that contain special characters or are empty
    const needsQuoting =
      stringField === "" ||
      stringField.includes(",") ||
      stringField.includes('"') ||
      stringField.includes("\n") ||
      stringField.includes("\r") ||
      stringField.startsWith(" ") ||
      stringField.endsWith(" ")

    if (needsQuoting) {
      // Escape internal quotes by doubling them
      const escapedField = stringField.replace(/"/g, '""')
      return `"${escapedField}"`
    }

    return stringField
  }

  async waitForElement(selectors, timeout = 5000) {
    const selectorArray = Array.isArray(selectors) ? selectors : [selectors]

    return new Promise((resolve, reject) => {
      // Check if element already exists
      for (const selector of selectorArray) {
        const element = document.querySelector(selector)
        if (element) {
          resolve(element)
          return
        }
      }

      const observer = new MutationObserver(() => {
        for (const selector of selectorArray) {
          const element = document.querySelector(selector)
          if (element) {
            observer.disconnect()
            resolve(element)
            return
          }
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      setTimeout(() => {
        observer.disconnect()
        reject(new Error(`Elements ${selectorArray.join(", ")} not found within ${timeout}ms`))
      }, timeout)
    })
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

console.log("[v0] Content script loaded, document state:", document.readyState)

function initializeExtractor() {
  console.log("[v0] Initializing extractor...")
  new WhatsAppContactsExtractor()
}

if (document.readyState === "loading") {
  console.log("[v0] Document still loading, waiting for DOMContentLoaded...")
  document.addEventListener("DOMContentLoaded", initializeExtractor)
} else {
  console.log("[v0] Document ready, initializing immediately...")
  initializeExtractor()
}

setTimeout(() => {
  console.log("[v0] Delayed initialization check...")
  if (!window.whatsappExtractorInitialized) {
    console.log("[v0] Running delayed initialization...")
    window.whatsappExtractorInitialized = true
    initializeExtractor()
  }
}, 2000)

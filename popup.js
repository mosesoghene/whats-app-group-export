// Declare chrome variable to fix lint/correctness/noUndeclaredVariables error
const chrome = window.chrome

class PopupController {
  constructor() {
    this.exportBtn = document.getElementById("exportBtn")
    this.statusText = document.getElementById("statusText")
    this.statusIndicator = document.getElementById("statusIndicator")
    this.statusCard = document.getElementById("statusCard")
    this.helpText = document.getElementById("helpText")
    this.exportSection = document.getElementById("exportSection")
    this.progressSection = document.getElementById("progressSection")
    this.progressFill = document.getElementById("progressFill")
    this.progressText = document.getElementById("progressText")
    this.progressPercentage = document.getElementById("progressPercentage")
    this.resultsSection = document.getElementById("resultsSection")
    this.resultsText = document.getElementById("resultsText")
    this.themeToggle = document.getElementById("themeToggle")
    this.refreshBtn = document.getElementById("refreshBtn")

    this.contactCount = document.getElementById("contactCount")
    this.contactCountNumber = document.getElementById("contactCountNumber")
    this.previewBtn = document.getElementById("previewBtn")
    this.quickScanBtn = document.getElementById("quickScanBtn")
    this.previewModal = document.getElementById("previewModal")
    this.closePreview = document.getElementById("closePreview")
    this.contactSearch = document.getElementById("contactSearch")
    this.contactList = document.getElementById("contactList")
    this.exportFromPreview = document.getElementById("exportFromPreview")

    this.isExporting = false
    this.currentGroupName = ""
    this.cachedContacts = [] // Added contact caching
    this.selectedContacts = new Set() // Added contact selection

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.loadTheme()
    this.checkWhatsAppStatus()
  }

  setupEventListeners() {
    this.exportBtn.addEventListener("click", () => this.handleExport())
    this.themeToggle.addEventListener("click", () => this.toggleTheme())
    this.refreshBtn.addEventListener("click", () => this.checkWhatsAppStatus())

    this.previewBtn.addEventListener("click", () => this.showContactPreview())
    this.quickScanBtn.addEventListener("click", () => this.quickScanContacts())
    this.closePreview.addEventListener("click", () => this.hideContactPreview())
    this.contactSearch.addEventListener("input", (e) => this.filterContacts(e.target.value))
    this.exportFromPreview.addEventListener("click", () => this.exportSelectedContacts())

    // Close modal when clicking overlay
    this.previewModal.addEventListener("click", (e) => {
      if (e.target === this.previewModal) {
        this.hideContactPreview()
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !this.exportBtn.disabled && !this.isExporting) {
        this.handleExport()
      } else if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault()
        this.checkWhatsAppStatus()
      } else if (e.key === "Escape" && this.previewModal.style.display !== "none") {
        this.hideContactPreview()
      }
    })
  }

  async checkWhatsAppStatus() {
    this.updateStatus("Checking WhatsApp Web...", "default")
    this.hideResults()
    this.hideContactCount()

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      if (!tab.url.includes("web.whatsapp.com")) {
        this.updateStatus("Please open WhatsApp Web", "error")
        this.showHelpText("Navigate to web.whatsapp.com in your browser.")
        this.disableExportSection()
        return
      }

      // Send message to content script to check if group is open
      chrome.tabs.sendMessage(tab.id, { action: "checkStatus" }, (response) => {
        if (chrome.runtime.lastError) {
          this.updateStatus("WhatsApp Web not loaded", "error")
          this.showHelpText("Please refresh WhatsApp Web and try again.")
          this.disableExportSection()
          return
        }

        if (response && response.isGroupOpen) {
          this.currentGroupName = response.groupName
          this.updateStatus(`Group detected: ${response.groupName}`, "connected")
          this.hideHelpText()
          this.enableExportSection()
          this.showQuickScan() // Show quick scan option
        } else {
          this.updateStatus("Please open a WhatsApp group", "error")
          this.showHelpText("Select a group chat to export its contacts.")
          this.disableExportSection()
        }
      })
    } catch (error) {
      this.updateStatus("Error checking WhatsApp", "error")
      this.showHelpText("Please try refreshing the page.")
      this.disableExportSection()
    }
  }

  async quickScanContacts() {
    this.updateStatus("Scanning contacts...", "default")

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      chrome.tabs.sendMessage(tab.id, { action: "quickScan" }, (response) => {
        if (chrome.runtime.lastError) {
          this.updateStatus("Failed to scan contacts", "error")
          return
        }

        if (response && response.success) {
          this.cachedContacts = response.contacts
          this.showContactCount(response.contacts.length)
          this.updateStatus(`Group detected: ${this.currentGroupName}`, "connected")
        } else {
          this.updateStatus("Failed to scan contacts", "error")
        }
      })
    } catch (error) {
      this.updateStatus("Scan failed", "error")
    }
  }

  async showContactPreview() {
    if (this.cachedContacts.length === 0) {
      await this.quickScanContacts()
    }

    if (this.cachedContacts.length === 0) {
      return
    }

    this.populateContactPreview()
    this.previewModal.style.display = "flex"
  }

  hideContactPreview() {
    this.previewModal.style.display = "none"
  }

  populateContactPreview() {
    const contacts = this.getFilteredContacts()

    // Update stats
    const adminCount = contacts.filter((c) => c.isAdmin).length
    const phoneCount = contacts.filter((c) => c.phoneNumber).length

    document.getElementById("totalContacts").textContent = contacts.length
    document.getElementById("adminContacts").textContent = adminCount
    document.getElementById("phoneContacts").textContent = phoneCount

    // Clear and populate contact list
    this.contactList.innerHTML = ""
    this.selectedContacts.clear()

    contacts.forEach((contact, index) => {
      const contactItem = this.createContactItem(contact, index)
      this.contactList.appendChild(contactItem)
      this.selectedContacts.add(index) // Select all by default
    })

    this.updateExportButton()
  }

  createContactItem(contact, index) {
    const item = document.createElement("div")
    item.className = "contact-item"

    const checkbox = document.createElement("div")
    checkbox.className = "contact-checkbox checked"
    checkbox.addEventListener("click", () => this.toggleContactSelection(index, checkbox))

    const info = document.createElement("div")
    info.className = "contact-info"

    const name = document.createElement("div")
    name.className = "contact-name"
    name.innerHTML = `
      ${contact.name}
      ${contact.isAdmin ? '<span class="admin-badge">Admin</span>' : ""}
    `

    const details = document.createElement("div")
    details.className = "contact-details"

    if (contact.phoneNumber) {
      const phone = document.createElement("div")
      phone.textContent = `📞 ${contact.phoneNumber}`
      details.appendChild(phone)
    }

    if (contact.status) {
      const status = document.createElement("div")
      status.textContent = `💬 ${contact.status}`
      details.appendChild(status)
    }

    info.appendChild(name)
    info.appendChild(details)

    item.appendChild(checkbox)
    item.appendChild(info)

    return item
  }

  toggleContactSelection(index, checkbox) {
    if (this.selectedContacts.has(index)) {
      this.selectedContacts.delete(index)
      checkbox.classList.remove("checked")
    } else {
      this.selectedContacts.add(index)
      checkbox.classList.add("checked")
    }

    this.updateExportButton()
  }

  updateExportButton() {
    const selectedCount = this.selectedContacts.size
    this.exportFromPreview.textContent = `Export Selected (${selectedCount})`
    this.exportFromPreview.disabled = selectedCount === 0
  }

  filterContacts(query) {
    const items = this.contactList.querySelectorAll(".contact-item")
    const searchTerm = query.toLowerCase()

    items.forEach((item, index) => {
      const contact = this.getFilteredContacts()[index]
      const matchesSearch =
        !searchTerm ||
        contact.name.toLowerCase().includes(searchTerm) ||
        (contact.phoneNumber && contact.phoneNumber.includes(searchTerm)) ||
        (contact.status && contact.status.toLowerCase().includes(searchTerm))

      item.style.display = matchesSearch ? "flex" : "none"
    })
  }

  getFilteredContacts() {
    let contacts = [...this.cachedContacts]

    const includeAdminsOnly = document.getElementById("includeAdmins").checked
    const removeDuplicates = document.getElementById("removeDuplicates").checked
    const validatePhones = document.getElementById("validatePhones").checked

    if (includeAdminsOnly) {
      contacts = contacts.filter((c) => c.isAdmin)
    }

    if (validatePhones) {
      contacts = contacts.filter((c) => c.phoneNumber && this.isValidPhoneNumber(c.phoneNumber))
    }

    if (removeDuplicates) {
      const seen = new Set()
      contacts = contacts.filter((c) => {
        const key = c.phoneNumber || c.name
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    }

    return contacts
  }

  isValidPhoneNumber(phone) {
    if (!phone) return false
    const cleaned = phone.replace(/[\s\-$$$$.]/g, "")
    return /^\+?[\d]{7,15}$/.test(cleaned)
  }

  async exportSelectedContacts() {
    const selectedContacts = Array.from(this.selectedContacts).map((index) => this.getFilteredContacts()[index])

    if (selectedContacts.length === 0) {
      return
    }

    const format = document.querySelector('input[name="format"]:checked').value
    const { data, filename } = this.generateFileContent(selectedContacts, format)

    this.downloadFile(data, filename, format)
    this.showResults(selectedContacts.length, format)
    this.hideContactPreview()
  }

  generateFileContent(contacts, format) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-")
    const groupNameSafe = this.currentGroupName.replace(/[^a-zA-Z0-9]/g, "_")

    switch (format) {
      case "json":
        return {
          data: this.generateJSON(contacts),
          filename: `whatsapp_contacts_${groupNameSafe}_${timestamp}.json`,
        }
      case "vcf":
        return {
          data: this.generateVCF(contacts),
          filename: `whatsapp_contacts_${groupNameSafe}_${timestamp}.vcf`,
        }
      default:
        // Use existing CSV/TXT generation from content script
        return { data: "", filename: "" }
    }
  }

  generateJSON(contacts) {
    const exportData = {
      metadata: {
        groupName: this.currentGroupName,
        exportDate: new Date().toISOString(),
        totalContacts: contacts.length,
        exportedBy: "WhatsApp Contacts Exporter",
      },
      contacts: contacts.map((contact) => ({
        name: contact.name,
        phoneNumber: contact.phoneNumber || null,
        status: contact.status || null,
        isAdmin: contact.isAdmin,
        contactType: this.determineContactType(contact),
      })),
    }

    return JSON.stringify(exportData, null, 2)
  }

  generateVCF(contacts) {
    let vcfContent = ""

    contacts.forEach((contact) => {
      vcfContent += "BEGIN:VCARD\n"
      vcfContent += "VERSION:3.0\n"
      vcfContent += `FN:${contact.name}\n`

      if (contact.phoneNumber) {
        vcfContent += `TEL:${contact.phoneNumber}\n`
      }

      if (contact.status) {
        vcfContent += `NOTE:${contact.status}\n`
      }

      if (contact.isAdmin) {
        vcfContent += `TITLE:WhatsApp Group Admin\n`
      }

      vcfContent += `ORG:${this.currentGroupName}\n`
      vcfContent += "END:VCARD\n\n"
    })

    return vcfContent
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

  updateStatus(text, type = "default") {
    this.statusText.textContent = text
    this.statusIndicator.className = `status-indicator ${type}`
  }

  showHelpText(text) {
    if (text) {
      this.helpText.querySelector("p").textContent = text
    }
    this.helpText.style.display = "block"
  }

  hideHelpText() {
    this.helpText.style.display = "none"
  }

  showContactCount(count) {
    this.contactCountNumber.textContent = count
    this.contactCount.style.display = "flex"
  }

  hideContactCount() {
    this.contactCount.style.display = "none"
  }

  showQuickScan() {
    this.quickScanBtn.style.display = "block"
  }

  enableExportSection() {
    this.exportSection.classList.add("enabled")
    this.exportBtn.disabled = false
  }

  disableExportSection() {
    this.exportSection.classList.remove("enabled")
    this.exportBtn.disabled = true
  }

  hideResults() {
    this.resultsSection.style.display = "none"
  }

  showResults(count, format) {
    this.resultsText.textContent = `Successfully exported ${count} contacts as ${format.toUpperCase()}`
    this.resultsSection.style.display = "block"
  }

  async handleExport() {
    if (this.isExporting) return

    const includeAdminsOnly = document.getElementById("includeAdmins").checked
    const format = document.querySelector('input[name="format"]:checked').value

    if (format === "json" || format === "vcf") {
      if (this.cachedContacts.length === 0) {
        await this.quickScanContacts()
      }

      if (this.cachedContacts.length === 0) {
        return
      }

      const filteredContacts = this.getFilteredContacts()
      const { data, filename } = this.generateFileContent(filteredContacts, format)
      this.downloadFile(data, filename, format)
      this.showResults(filteredContacts.length, format)
      return
    }

    this.isExporting = true
    this.exportBtn.disabled = true
    this.hideResults()
    this.progressSection.style.display = "block"
    this.updateProgress(0, "Preparing export...")

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

      this.updateProgress(10, "Opening group info...")

      chrome.tabs.sendMessage(
        tab.id,
        {
          action: "exportContacts",
          options: { includeAdminsOnly, format },
        },
        (response) => {
          if (chrome.runtime.lastError) {
            this.handleExportError("Failed to communicate with WhatsApp")
            return
          }

          if (response.success) {
            this.updateProgress(90, "Generating file...")
            this.downloadFile(response.data, response.filename, format)
            this.updateProgress(100, "Export completed!")

            setTimeout(() => {
              this.showResults(response.count, format)
              this.progressSection.style.display = "none"
              this.isExporting = false
              this.exportBtn.disabled = false
            }, 1500)
          } else {
            this.handleExportError(response.error)
          }
        },
      )
    } catch (error) {
      this.handleExportError("Export failed")
    }
  }

  updateProgress(percent, text) {
    this.progressFill.style.width = `${percent}%`
    this.progressText.textContent = text
    this.progressPercentage.textContent = `${percent}%`
  }

  handleExportError(message) {
    this.updateProgress(0, message)
    this.progressPercentage.textContent = "Error"
    this.isExporting = false
    this.exportBtn.disabled = false

    setTimeout(() => {
      this.progressSection.style.display = "none"
      this.checkWhatsAppStatus() // Refresh status after error
    }, 3000)
  }

  downloadFile(data, filename, format) {
    const mimeTypes = {
      csv: "text/csv",
      txt: "text/plain",
      json: "application/json",
      vcf: "text/vcard",
    }

    const blob = new Blob([data], {
      type: mimeTypes[format] || "text/plain",
    })
    const url = URL.createObjectURL(blob)

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true,
    })
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    document.documentElement.setAttribute("data-theme", newTheme)
    this.themeToggle.querySelector(".theme-icon").textContent = newTheme === "dark" ? "☀️" : "🌙"

    localStorage.setItem("theme", newTheme)
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.setAttribute("data-theme", savedTheme)
    this.themeToggle.querySelector(".theme-icon").textContent = savedTheme === "dark" ? "☀️" : "🌙"
  }
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PopupController()
})

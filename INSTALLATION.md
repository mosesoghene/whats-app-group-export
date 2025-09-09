# Installation Guide

This guide provides detailed step-by-step instructions for installing the WhatsApp Contacts Exporter Chrome extension.

## Prerequisites

- **Google Chrome** version 88 or higher
- **Active WhatsApp account** with access to WhatsApp Web
- **Basic computer skills** for file management

## Installation Methods

### Method 1: Load Unpacked Extension (Recommended)

This method is recommended for users who want to use the extension immediately or for development purposes.

#### Step 1: Download Extension Files

1. **Download the ZIP file**
   - Go to the project repository
   - Click the green "Code" button
   - Select "Download ZIP"

2. **Extract the files**
   - Locate the downloaded ZIP file
   - Right-click and select "Extract All" (Windows) or double-click (Mac)
   - Choose a permanent location (e.g., `Documents/Chrome Extensions/`)
   - Remember this location - don't delete these files after installation

#### Step 2: Open Chrome Extensions

1. **Open Google Chrome**
2. **Navigate to Extensions page** using one of these methods:
   - Type `chrome://extensions/` in the address bar
   - Click Menu (⋮) → More Tools → Extensions
   - Use keyboard shortcut: `Ctrl+Shift+Delete` then click "Extensions"

#### Step 3: Enable Developer Mode

1. **Find the Developer Mode toggle**
   - Look for the toggle switch in the top-right corner
   - It should say "Developer mode"

2. **Enable Developer Mode**
   - Click the toggle to turn it ON
   - The toggle should turn blue/green
   - New buttons will appear: "Load unpacked", "Pack extension", "Update"

#### Step 4: Load the Extension

1. **Click "Load unpacked"**
   - This button appears after enabling Developer Mode

2. **Select the extension folder**
   - Navigate to where you extracted the files
   - Select the folder containing `manifest.json`
   - Click "Select Folder" (Windows) or "Open" (Mac)

3. **Verify installation**
   - The extension should appear in your extensions list
   - Look for "WhatsApp Contacts Exporter"
   - It should show as "Enabled"

#### Step 5: Pin the Extension (Optional but Recommended)

1. **Open the Extensions menu**
   - Click the puzzle piece icon (🧩) in Chrome's toolbar
   - This opens the extensions dropdown

2. **Pin the extension**
   - Find "WhatsApp Contacts Exporter" in the list
   - Click the pin icon (📌) next to it
   - The extension icon will now appear in your toolbar

### Method 2: Chrome Web Store (Future)

*This extension will be available on the Chrome Web Store in the future. This section will be updated when available.*

## Verification Steps

After installation, verify the extension is working correctly:

### 1. Check Extension Status
- Go to `chrome://extensions/`
- Find "WhatsApp Contacts Exporter"
- Ensure it shows "Enabled" status
- No error messages should be displayed

### 2. Test Basic Functionality
1. **Open WhatsApp Web**
   - Navigate to [web.whatsapp.com](https://web.whatsapp.com)
   - Log in by scanning QR code with your phone

2. **Open a group chat**
   - Click on any WhatsApp group from your chat list

3. **Test the extension**
   - Click the extension icon in your toolbar
   - You should see "Group detected: [Group Name]"
   - The export button should be enabled

## Troubleshooting Installation

### Common Installation Issues

#### "This extension may have been corrupted" Error
**Cause**: Incomplete download or extraction
**Solution**:
1. Delete the extracted folder
2. Re-download the ZIP file
3. Extract to a new location
4. Try loading the extension again

#### "Manifest file is missing or unreadable" Error
**Cause**: Wrong folder selected or corrupted files
**Solution**:
1. Ensure you selected the folder containing `manifest.json`
2. Check that all files are present:
   - `manifest.json`
   - `popup.html`
   - `popup.css`
   - `popup.js`
   - `content.js`
   - `background.js`

#### Extension Not Appearing in Toolbar
**Cause**: Extension not pinned
**Solution**:
1. Click the puzzle piece icon (🧩)
2. Find the extension in the dropdown
3. Click the pin icon to add it to toolbar

#### "Developer Mode" Toggle Not Visible
**Cause**: Managed Chrome browser (corporate/school)
**Solution**:
- Contact your IT administrator
- Developer mode may be disabled by policy
- Try using a personal Chrome profile

### Permission Issues

#### Extension Asking for Permissions
The extension requires these permissions:
- **Active Tab**: To interact with WhatsApp Web
- **Downloads**: To save exported files
- **Host Permissions**: To run only on web.whatsapp.com

These are safe and necessary for the extension to function.

## Updating the Extension

### Manual Update (Load Unpacked)
1. Download the new version files
2. Extract to the same location (overwrite old files)
3. Go to `chrome://extensions/`
4. Find the extension and click the refresh icon (🔄)
5. The extension will reload with new features

### Automatic Updates (Chrome Web Store)
*When available on Chrome Web Store, updates will be automatic*

## Uninstalling the Extension

### Complete Removal
1. **Remove from Chrome**
   - Go to `chrome://extensions/`
   - Find "WhatsApp Contacts Exporter"
   - Click "Remove"
   - Confirm removal

2. **Delete files (Optional)**
   - Delete the extracted extension folder
   - This frees up disk space

### Temporary Disable
1. Go to `chrome://extensions/`
2. Find the extension
3. Toggle the switch to "OFF"
4. Extension remains installed but inactive

## Security Considerations

### Safe Installation Practices
- Only download from trusted sources
- Verify file integrity after download
- Keep extension files in a secure location
- Regularly update to latest version

### Privacy Protection
- Extension only works on WhatsApp Web
- No data sent to external servers
- All processing happens locally
- No tracking or analytics

## Advanced Installation Options

### Multiple Chrome Profiles
You can install the extension on different Chrome profiles:
1. Switch to desired profile
2. Follow standard installation steps
3. Each profile maintains separate extension settings

### Enterprise Deployment
For organizations wanting to deploy this extension:
1. Package the extension as a .crx file
2. Use Chrome Enterprise policies
3. Deploy through managed Chrome browsers
4. Contact IT administrator for assistance

## Getting Help

If you encounter issues during installation:

1. **Check Prerequisites**
   - Verify Chrome version compatibility
   - Ensure you have admin rights (if required)

2. **Review Error Messages**
   - Read any error messages carefully
   - Check the troubleshooting section above

3. **Try Alternative Methods**
   - Use a different extraction tool
   - Try a different folder location
   - Restart Chrome and try again

4. **Seek Support**
   - Check the main README.md for additional help
   - Review common issues and solutions
   - Report persistent issues with detailed information

## Next Steps

After successful installation:
1. Read the [Usage Guide](README.md#usage-instructions)
2. Explore the [Features](README.md#features)
3. Try exporting contacts from a test group
4. Customize settings to your preferences

Remember to keep the extension files in their installation location - deleting them will break the extension!

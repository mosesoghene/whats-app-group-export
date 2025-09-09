# WhatsApp Contacts Exporter

A powerful Chrome extension that allows you to export all contacts from a WhatsApp group into various file formats (CSV, TXT, JSON, vCard). Perfect for backing up group contacts, creating mailing lists, or importing contacts into other applications.

## Features

### Core Features
- **Export WhatsApp group contacts** to multiple formats
- **Works with WhatsApp Web** - no need to install additional software
- **Multiple export formats**: CSV, TXT, JSON, and vCard (.vcf)
- **Smart contact detection** with fallback selectors for UI changes
- **Admin filtering** - export only group administrators
- **Dark/Light mode** toggle for comfortable usage

### Advanced Features
- **Contact preview** with search and individual selection
- **Duplicate detection** and removal
- **Phone number validation** to ensure data quality
- **Quick scan** to preview contacts before export
- **Enhanced CSV format** with metadata and Excel compatibility
- **Structured TXT export** with statistics and organization
- **JSON export** for developers and data analysis
- **vCard export** for direct import into contact applications

### Export Formats

#### CSV Format
- Excel-compatible with UTF-8 BOM
- Comprehensive metadata headers
- Formatted phone numbers
- Contact type classification
- Export statistics

#### TXT Format
- Human-readable format
- Organized by admin status
- Contact statistics
- Export metadata

#### JSON Format
- Structured data format
- Complete metadata
- Perfect for developers
- Easy to parse and process

#### vCard Format
- Standard contact card format
- Direct import into contact apps
- Preserves contact relationships
- Cross-platform compatibility

## Installation

### Method 1: Load Unpacked Extension (Recommended for Development)

1. **Download the extension files**
   - Clone this repository or download as ZIP
   - Extract all files to a folder on your computer

2. **Open Chrome Extensions page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked" button
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

5. **Pin the extension (Optional)**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "WhatsApp Contacts Exporter"
   - Click the pin icon to keep it visible

### Method 2: Chrome Web Store (Future Release)
*This extension will be available on the Chrome Web Store soon.*

## Usage Instructions

### Basic Export

1. **Open WhatsApp Web**
   - Navigate to [web.whatsapp.com](https://web.whatsapp.com)
   - Log in with your phone by scanning the QR code

2. **Select a Group Chat**
   - Click on any WhatsApp group from your chat list
   - Make sure the group is open and active

3. **Open the Extension**
   - Click the WhatsApp Contacts Exporter icon in your Chrome toolbar
   - The extension will automatically detect the open group

4. **Configure Export Options**
   - Choose your preferred file format (CSV, TXT, JSON, or vCard)
   - Select filtering options:
     - **Export admins only**: Only include group administrators
     - **Remove duplicates**: Filter out duplicate contacts
     - **Validate phone numbers**: Only include contacts with valid phone numbers

5. **Export Contacts**
   - Click the "Export Contacts" button
   - Choose where to save the file
   - Your contacts will be downloaded automatically

### Advanced Features

#### Contact Preview
1. Click the "Preview" button after the extension detects contacts
2. Search and filter contacts in the preview window
3. Select/deselect individual contacts
4. Export only selected contacts

#### Quick Scan
1. Use the quick scan button (magnifying glass icon) to preview contact count
2. Get instant feedback on how many contacts are available
3. No need to open group info panel

#### Theme Toggle
- Click the moon/sun icon to switch between dark and light themes
- Your preference is automatically saved

## Troubleshooting

### Common Issues

#### "Please open WhatsApp Web" Error
- **Solution**: Make sure you're on the web.whatsapp.com domain
- Refresh the WhatsApp Web page and try again

#### "WhatsApp Web not loaded" Error
- **Solution**: Wait for WhatsApp Web to fully load
- Check your internet connection
- Try refreshing the page

#### "Please open a WhatsApp group" Error
- **Solution**: Click on a group chat in your WhatsApp chat list
- Make sure it's a group (not an individual chat)
- The group must have multiple participants

#### "No contacts found" Error
- **Solution**: The group might be empty or have loading issues
- Try scrolling in the group to load participant list
- Refresh WhatsApp Web and try again

#### Extension Not Working After WhatsApp Update
- **Solution**: WhatsApp frequently updates their interface
- Try refreshing the WhatsApp Web page
- Update the extension if a new version is available
- The extension uses multiple fallback selectors to handle UI changes

### Performance Tips

- **Large Groups**: For groups with 100+ members, the export may take longer
- **Slow Internet**: Wait for all participants to load before exporting
- **Multiple Exports**: Wait for one export to complete before starting another

## Privacy & Security

### Data Handling
- **No data is sent to external servers** - everything runs locally in your browser
- **No personal information is stored** - the extension only processes visible contact data
- **No tracking or analytics** - your privacy is completely protected

### Permissions Explained
- **activeTab**: Required to interact with the current WhatsApp Web tab
- **downloads**: Required to save exported files to your computer
- **host_permissions for web.whatsapp.com**: Required to run on WhatsApp Web only

### Security Features
- Extension only works on official WhatsApp Web domain
- No access to your WhatsApp messages or media
- No background data collection
- Open source code for transparency

## Technical Details

### Browser Compatibility
- **Google Chrome**: Version 88+ (Manifest V3 support)
- **Microsoft Edge**: Version 88+ (Chromium-based)
- **Other Chromium browsers**: Should work with Manifest V3 support

### File Format Specifications

#### CSV Format
\`\`\`
Full Name,Phone Number,Status Message,Admin Role,Contact Type,Export Date,Group Name
"John Doe","+1 (555) 123-4567","Available","Member","Complete","2024-01-15 10:30:00","My Group"
\`\`\`

#### JSON Format
\`\`\`json
{
  "metadata": {
    "groupName": "My Group",
    "exportDate": "2024-01-15T10:30:00.000Z",
    "totalContacts": 25,
    "exportedBy": "WhatsApp Contacts Exporter"
  },
  "contacts": [
    {
      "name": "John Doe",
      "phoneNumber": "+1 (555) 123-4567",
      "status": "Available",
      "isAdmin": false,
      "contactType": "Complete"
    }
  ]
}
\`\`\`

#### vCard Format
\`\`\`
BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+1 (555) 123-4567
NOTE:Available
ORG:My Group
END:VCARD
\`\`\`

## Development

### Project Structure
\`\`\`
whatsapp-contacts-exporter/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup logic and UI controller
├── content.js             # WhatsApp Web interaction script
├── background.js          # Background service worker
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This documentation
\`\`\`

### Key Components

#### Content Script (`content.js`)
- Interacts with WhatsApp Web DOM
- Extracts contact information
- Handles group info panel navigation
- Manages contact data processing

#### Popup Interface (`popup.js`, `popup.html`, `popup.css`)
- User interface for the extension
- Export configuration options
- Contact preview and selection
- Theme management

#### Background Script (`background.js`)
- Handles file downloads
- Manages extension lifecycle
- Processes cross-tab communication

### Building and Testing

1. **Load the extension** in Chrome (see Installation instructions)
2. **Test on different groups** with various sizes and configurations
3. **Check console logs** for any errors or warnings
4. **Verify exports** by opening the generated files

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with different WhatsApp groups
5. Submit a pull request

## Changelog

### Version 1.0.0
- Initial release
- Basic CSV and TXT export functionality
- Dark/light theme support
- Admin filtering

### Version 1.1.0 (Current)
- Added contact preview with search and selection
- Duplicate detection and removal
- Phone number validation
- JSON and vCard export formats
- Quick scan functionality
- Enhanced UI with statistics
- Improved error handling and user feedback

## Support

### Getting Help
- Check the troubleshooting section above
- Review common issues and solutions
- Ensure you're using a supported browser version

### Reporting Issues
When reporting issues, please include:
- Chrome version
- Extension version
- WhatsApp Web interface language
- Steps to reproduce the issue
- Any console error messages

### Feature Requests
We welcome suggestions for new features! Consider:
- Export format preferences
- Additional filtering options
- UI improvements
- Integration capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This extension is not affiliated with, endorsed by, or sponsored by WhatsApp Inc. or Meta Platforms, Inc. WhatsApp is a trademark of WhatsApp Inc. This extension is provided "as is" without warranty of any kind. Use at your own risk.

The extension only accesses publicly visible contact information in WhatsApp groups and does not access private messages, media, or other sensitive data.
\`\`\`

```json file="" isHidden

# Troubleshooting Guide

This comprehensive guide helps you resolve common issues with the WhatsApp Contacts Exporter extension.

## Quick Diagnostics

Before diving into specific issues, run through this quick checklist:

- [ ] Chrome version 88 or higher
- [ ] Extension is enabled in `chrome://extensions/`
- [ ] You're on `web.whatsapp.com` (not mobile app)
- [ ] You're in a group chat (not individual chat)
- [ ] WhatsApp Web is fully loaded
- [ ] Group has multiple participants

## Common Issues and Solutions

### 1. Extension Detection Issues

#### "Please open WhatsApp Web" Error

**Symptoms:**
- Red status indicator
- Message: "Please open WhatsApp Web"
- Export button disabled

**Causes & Solutions:**

**Wrong Website**
- **Problem**: You're not on the official WhatsApp Web
- **Solution**: Navigate to [web.whatsapp.com](https://web.whatsapp.com)
- **Check**: URL must start with `https://web.whatsapp.com`

**Browser Tab Issues**
- **Problem**: Extension checking wrong tab
- **Solution**: 
  1. Close other WhatsApp Web tabs
  2. Refresh the current tab
  3. Click the extension icon again

**Extension Permissions**
- **Problem**: Extension lacks necessary permissions
- **Solution**:
  1. Go to `chrome://extensions/`
  2. Find the extension
  3. Click "Details"
  4. Ensure "Allow on all sites" or specific site permissions

#### "WhatsApp Web not loaded" Error

**Symptoms:**
- Extension can't communicate with WhatsApp
- Status shows "WhatsApp Web not loaded"

**Solutions:**

**Page Not Fully Loaded**
1. Wait for WhatsApp Web to completely load
2. Look for the main chat interface
3. Ensure you're logged in (QR code scanned)
4. Try refreshing the page

**Content Script Issues**
1. Open Chrome DevTools (F12)
2. Check Console for errors
3. Look for content script loading issues
4. Refresh the page and try again

**Browser Cache Problems**
1. Clear browser cache for WhatsApp Web:
   - Press `Ctrl+Shift+Delete`
   - Select "Cached images and files"
   - Choose "Last hour" or "Last 24 hours"
   - Click "Clear data"
2. Refresh WhatsApp Web

### 2. Group Detection Issues

#### "Please open a WhatsApp group" Error

**Symptoms:**
- Extension detects WhatsApp but not a group
- Individual chats don't work
- Empty groups not detected

**Solutions:**

**Not in a Group Chat**
- **Problem**: You're in an individual chat
- **Solution**: Click on a group chat from your chat list
- **Verification**: Group chats show participant count (e.g., "25 participants")

**Group Not Fully Loaded**
- **Problem**: Group information hasn't loaded
- **Solution**:
  1. Click on the group name at the top
  2. Wait for group info to load
  3. Close group info panel
  4. Try the extension again

**Empty or Small Groups**
- **Problem**: Group has only 1-2 participants
- **Solution**: Extension works best with groups of 3+ members
- **Workaround**: Try with a larger group first

### 3. Contact Extraction Issues

#### "No contacts found" Error

**Symptoms:**
- Export process starts but finds no contacts
- Progress bar completes but no file generated

**Solutions:**

**Group Info Panel Issues**
1. **Manual Test**:
   - Click on group name at top of chat
   - Look for "Participants" section
   - Ensure you can see group members
   - Close the panel

2. **Scroll Loading**:
   - In group info, scroll down to load all members
   - Large groups may need time to load all participants
   - Wait for loading indicators to disappear

**WhatsApp Interface Changes**
- **Problem**: WhatsApp updated their interface
- **Solution**: Extension uses multiple fallback selectors
- **Workaround**: Try refreshing and waiting a few minutes

**Network Issues**
- **Problem**: Slow internet preventing full load
- **Solution**:
  1. Check internet connection
  2. Wait for all participants to load
  3. Try during off-peak hours

#### Incomplete Contact Information

**Symptoms:**
- Some contacts missing phone numbers
- Status messages not captured
- Admin status incorrect

**Explanations:**

**Privacy Settings**
- **Cause**: Users have restricted visibility of their info
- **Normal**: Not all users show phone numbers publicly
- **Solution**: This is expected behavior, not an error

**Loading Timing**
- **Cause**: Information loads progressively
- **Solution**: Wait longer before exporting
- **Tip**: Use "Quick Scan" first to preview available data

### 4. Export Process Issues

#### Export Hangs or Freezes

**Symptoms:**
- Progress bar stops moving
- Browser becomes unresponsive
- Export never completes

**Solutions:**

**Large Groups (100+ members)**
1. **Increase Timeout**:
   - Close other browser tabs
   - Ensure stable internet connection
   - Wait up to 2-3 minutes for large groups

2. **Memory Issues**:
   - Close unnecessary applications
   - Restart Chrome
   - Try exporting in smaller batches (admins only first)

**Browser Performance**
1. **Clear Resources**:
   - Close other tabs
   - Disable other extensions temporarily
   - Restart Chrome

2. **System Resources**:
   - Close other applications
   - Ensure sufficient RAM available
   - Try on a less busy system

#### File Download Issues

**Symptoms:**
- Export completes but no file downloads
- Download blocked or fails

**Solutions:**

**Download Permissions**
1. Check Chrome download settings:
   - Go to `chrome://settings/downloads`
   - Ensure downloads are enabled
   - Check download location is accessible

2. **Popup Blockers**:
   - Disable popup blockers for WhatsApp Web
   - Allow downloads from the extension

**File System Issues**
- **Problem**: Insufficient disk space or permissions
- **Solution**:
  1. Check available disk space
  2. Try downloading to a different location
  3. Ensure write permissions to download folder

### 5. Format-Specific Issues

#### CSV Files Not Opening Correctly

**Symptoms:**
- Special characters appear as question marks
- Excel shows encoding errors
- Formatting looks wrong

**Solutions:**

**Encoding Issues**
1. **Excel Import**:
   - Open Excel
   - Use "Data" → "Get Data" → "From Text/CSV"
   - Select UTF-8 encoding
   - Import the file

2. **Alternative Programs**:
   - Try Google Sheets (handles UTF-8 better)
   - Use LibreOffice Calc
   - Open with a text editor first to verify content

#### JSON Files Invalid

**Symptoms:**
- JSON parsing errors
- Invalid format messages

**Solutions:**
1. **Validate JSON**:
   - Use online JSON validators
   - Check for syntax errors
   - Verify file wasn't corrupted during download

2. **Re-export**:
   - Try exporting again
   - Use a different format temporarily
   - Check for special characters in contact names

### 6. Performance Issues

#### Slow Export Process

**Symptoms:**
- Export takes very long time
- Browser becomes sluggish
- High CPU usage

**Optimization Tips:**

**Reduce Load**
1. **Filter Options**:
   - Use "Export admins only" for smaller exports
   - Enable "Validate phone numbers" to reduce processing
   - Remove duplicates to speed up processing

2. **Browser Optimization**:
   - Close unnecessary tabs
   - Disable other extensions temporarily
   - Use Chrome's Task Manager to monitor resources

**System Performance**
1. **Hardware Considerations**:
   - Ensure sufficient RAM (4GB+ recommended)
   - Close other applications
   - Use wired internet connection for stability

2. **Timing**:
   - Export during off-peak hours
   - Avoid exporting when WhatsApp Web is busy
   - Try smaller groups first to test performance

## Advanced Troubleshooting

### Developer Tools Debugging

If basic troubleshooting doesn't work, use Chrome Developer Tools:

1. **Open DevTools**:
   - Press F12 or right-click → "Inspect"
   - Go to "Console" tab

2. **Check for Errors**:
   - Look for red error messages
   - Note any extension-related errors
   - Check for network failures

3. **Extension Debugging**:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Inspect views: popup" on the extension
   - Check popup console for errors

### Network Issues

**Connection Problems**
1. **Test Connectivity**:
   - Ensure WhatsApp Web loads normally
   - Check for proxy or firewall issues
   - Try different network if possible

2. **Corporate Networks**:
   - Some corporate firewalls block extension functionality
   - Contact IT administrator
   - Try from personal network

### Extension Conflicts

**Other Extensions Interfering**
1. **Disable Other Extensions**:
   - Go to `chrome://extensions/`
   - Temporarily disable other extensions
   - Test if the issue resolves

2. **Common Conflicts**:
   - Ad blockers may interfere
   - Privacy extensions might block functionality
   - Other WhatsApp-related extensions

## Getting Additional Help

### Before Seeking Help

Gather this information:
- Chrome version (`chrome://version/`)
- Extension version
- Operating system
- WhatsApp Web language/region
- Group size and type
- Exact error messages
- Steps that led to the issue

### Reporting Issues

When reporting problems:
1. **Be Specific**: Describe exact steps and symptoms
2. **Include Screenshots**: Visual information helps diagnosis
3. **Provide Context**: Group size, browser setup, etc.
4. **Test Reproducibility**: Can you recreate the issue?

### Self-Help Resources

1. **Check Updates**: Ensure you have the latest version
2. **Review Documentation**: Re-read installation and usage guides
3. **Test Different Groups**: Try with various group sizes
4. **Browser Reset**: Try in incognito mode or fresh profile

## Prevention Tips

### Avoiding Common Issues

1. **Regular Updates**:
   - Keep Chrome updated
   - Update the extension when new versions available
   - Monitor WhatsApp Web changes

2. **Best Practices**:
   - Use stable internet connection
   - Close unnecessary browser tabs
   - Export during low-usage times
   - Keep extension files in permanent location

3. **Backup Strategy**:
   - Export contacts regularly
   - Use multiple formats for important groups
   - Test exports periodically to ensure functionality

Remember: Most issues are temporary and can be resolved with patience and systematic troubleshooting. The extension is designed to be robust and handle various WhatsApp Web interface changes.

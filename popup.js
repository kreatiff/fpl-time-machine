// popup.js

document.addEventListener('DOMContentLoaded', function() {
    // References to our toggle switches (only get elements that exist)
    const navToggle = document.getElementById('toggle-nav');
    const adsToggle = document.getElementById('toggle-ads');
    const retroToggle = document.getElementById('toggle-retro'); // This might be null if commented out
    const fullWidthToggle = document.getElementById('toggle-fullwidth');
    
    // Load current settings from storage when popup opens
    chrome.storage.sync.get(['hideNavigation', 'hideAds', 'useFlexLayout', 'useRetroStyle', 'useFullWidth'], function(result) {
        // If settings exist, apply them to the toggles, otherwise use defaults
        // Only set values for elements that exist
        if (navToggle) navToggle.checked = result.hideNavigation ?? false;
        if (adsToggle) adsToggle.checked = result.hideAds ?? true; // Default: hide ads
        if (retroToggle) retroToggle.checked = result.useRetroStyle ?? false; // Default: modern style
        if (fullWidthToggle) fullWidthToggle.checked = result.useFullWidth ?? false; // Toggle for full width (default off = constrained width)
        // Note: We still load useFlexLayout from storage but don't display it in the UI anymore
    });
    
    // Function to save settings and update UI
    function updateSettings() {
        const newSettings = {
            hideNavigation: navToggle ? navToggle.checked : false,
            hideAds: adsToggle ? adsToggle.checked : true,
            // Keep flex layout setting in storage but always set to true since we removed the toggle
            useFlexLayout: true,
            useRetroStyle: retroToggle ? retroToggle.checked : false,
            useFullWidth: fullWidthToggle ? fullWidthToggle.checked : false
        };
        
        // Save all settings to chrome.storage.sync
        chrome.storage.sync.set(newSettings);
        
        // Send message to content script to update UI immediately
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('fantasy.premierleague.com')) {
                try {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        settings: newSettings
                    }, function(response) {
                        // Check for error in the callback
                        const lastError = chrome.runtime.lastError;
                        if (lastError) {
                            console.log('Settings saved but could not update active tab: ' + lastError.message);
                            // Error happened but settings are still saved
                        } else if (response && response.status === 'success') {
                            console.log('Settings applied successfully to active tab');
                        }
                    });
                } catch (e) {
                    console.log('Error sending message to content script: ' + e.message);
                    // Settings are still saved even if we couldn't update the active tab
                }
            } else {
                console.log('Settings saved. No FPL tab is currently active.');
            }
        });
    }
    
    // Add change event listeners to toggles that exist
    if (navToggle) navToggle.addEventListener('change', updateSettings);
    if (adsToggle) adsToggle.addEventListener('change', updateSettings);
    if (retroToggle) retroToggle.addEventListener('change', updateSettings);
    if (fullWidthToggle) fullWidthToggle.addEventListener('change', updateSettings);
});

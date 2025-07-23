// popup.js

document.addEventListener('DOMContentLoaded', function() {
    // References to our toggle switches
    const navToggle = document.getElementById('toggle-nav');
    const adsToggle = document.getElementById('toggle-ads');
    const flexLayoutToggle = document.getElementById('toggle-flex-layout');
    
    // Load current settings from storage when popup opens
    chrome.storage.sync.get(['hideNavigation', 'hideAds', 'useFlexLayout'], function(result) {
        // If settings exist, apply them to the toggles, otherwise use defaults
        navToggle.checked = result.hideNavigation ?? false;
        adsToggle.checked = result.hideAds ?? true; // Default: hide ads
        flexLayoutToggle.checked = result.useFlexLayout ?? true; // Default: use flex layout
    });
    
    // Function to save settings and update UI
    function updateSettings() {
        const newSettings = {
            hideNavigation: navToggle.checked,
            hideAds: adsToggle.checked,
            useFlexLayout: flexLayoutToggle.checked
        };
        
        // Save all settings to chrome.storage.sync
        chrome.storage.sync.set(newSettings);
        
        // Send message to content script to update UI immediately
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('fantasy.premierleague.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateSettings',
                    settings: newSettings
                });
            }
        });
    }
    
    // Add change event listeners to all toggles
    navToggle.addEventListener('change', updateSettings);
    adsToggle.addEventListener('change', updateSettings);
    flexLayoutToggle.addEventListener('change', updateSettings);
});

// popup.js

document.addEventListener('DOMContentLoaded', function() {
    // References to our toggle switches
    const navToggle = document.getElementById('toggle-nav');
    const adsToggle = document.getElementById('toggle-ads');
    const retroToggle = document.getElementById('toggle-retro');
    
    // Load current settings from storage when popup opens
    chrome.storage.sync.get(['hideNavigation', 'hideAds', 'useFlexLayout', 'useRetroStyle'], function(result) {
        // If settings exist, apply them to the toggles, otherwise use defaults
        navToggle.checked = result.hideNavigation ?? false;
        adsToggle.checked = result.hideAds ?? true; // Default: hide ads
        retroToggle.checked = result.useRetroStyle ?? false; // Default: modern style
        // Note: We still load useFlexLayout from storage but don't display it in the UI anymore
    });
    
    // Function to save settings and update UI
    function updateSettings() {
        const newSettings = {
            hideNavigation: navToggle.checked,
            hideAds: adsToggle.checked,
            // Keep flex layout setting in storage but always set to true since we removed the toggle
            useFlexLayout: true,
            useRetroStyle: retroToggle.checked
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
    
    // Add change event listeners to all toggles
    navToggle.addEventListener('change', updateSettings);
    adsToggle.addEventListener('change', updateSettings);
    retroToggle.addEventListener('change', updateSettings);
});

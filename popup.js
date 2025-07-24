// popup.js

document.addEventListener('DOMContentLoaded', function() {
    // References to our toggle switches (only get elements that exist)
    const navToggle = document.getElementById('toggle-nav');
    const adsToggle = document.getElementById('toggle-ads');
    const retroToggle = document.getElementById('toggle-retro'); // This might be null if commented out
    const fullWidthToggle = document.getElementById('toggle-fullwidth');
    
    // Load current settings from storage when popup opens
    // The browser polyfill will automatically use the appropriate API
    browser.storage.sync.get(['hideNavigation', 'hideAds', 'useFlexLayout', 'useRetroStyle', 'useFullWidth']).then(function(result) {
        // If settings exist, apply them to the toggles, otherwise use defaults
        // Only set values for elements that exist
        if (navToggle) navToggle.checked = result.hideNavigation ?? false;
        if (adsToggle) adsToggle.checked = result.hideAds ?? true; // Default: hide ads
        if (retroToggle) retroToggle.checked = result.useRetroStyle ?? false; // Default: modern style
        if (fullWidthToggle) fullWidthToggle.checked = result.useFullWidth ?? false; // Toggle for full width (default off = constrained width)
        // Note: We still load useFlexLayout from storage but don't display it in the UI anymore
    }).catch(function(error) {
        console.log('Error loading settings:', error);
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
        
        // Save all settings to storage.sync
        browser.storage.sync.set(newSettings).catch(function(error) {
            console.log('Error saving settings:', error);
        });
        
        // Send message to content script to update UI immediately
        browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {
            if (tabs[0] && tabs[0].url.includes('fantasy.premierleague.com')) {
                try {
                    browser.tabs.sendMessage(tabs[0].id, {
                        action: 'updateSettings',
                        settings: newSettings
                    }).then(function(response) {
                        if (response && response.status === 'success') {
                            console.log('Settings applied successfully to active tab');
                        }
                    }).catch(function(error) {
                        console.log('Settings saved but could not update active tab:', error);
                        // Error happened but settings are still saved
                    });
                } catch (e) {
                    console.log('Error sending message to content script:', e);
                    // Settings are still saved even if we couldn't update the active tab
                }
            } else {
                console.log('Settings saved. No FPL tab is currently active.');
            }
        }).catch(function(error) {
            console.log('Error querying tabs:', error);
        });
    }
    
    // Add change event listeners to toggles that exist
    if (navToggle) navToggle.addEventListener('change', updateSettings);
    if (adsToggle) adsToggle.addEventListener('change', updateSettings);
    if (retroToggle) retroToggle.addEventListener('change', updateSettings);
    if (fullWidthToggle) fullWidthToggle.addEventListener('change', updateSettings);
});

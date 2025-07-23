// content.js

/**
 * @description Identifies key layout sections of the FPL website and applies persistent,
 * semantic CSS classes to them for easier custom styling.
 * This script is designed to be robust against changes in the website's own obfuscated class names.
 */

// Extension settings with defaults
let settings = {
    hideNavigation: false,
    hideAds: true,
    useFlexLayout: true,
    useRetroStyle: false
};

// Load settings from storage
function loadSettings() {
    chrome.storage.sync.get(['hideNavigation', 'hideAds', 'useFlexLayout', 'useRetroStyle'], function(result) {
        settings.hideNavigation = result.hideNavigation ?? false;
        settings.hideAds = result.hideAds ?? true;
        settings.useFlexLayout = result.useFlexLayout ?? true;
        settings.useRetroStyle = result.useRetroStyle ?? false;
        applySettings();
    });
}

// Apply current settings to the page
function applySettings() {
    toggleNavigation(settings.hideNavigation);
    toggleAdContainer(settings.hideAds);
    toggleFlexLayout(settings.useFlexLayout);
    toggleRetroStyle(settings.useRetroStyle);
    
    // Make sure our settings are applied even if the elements were initially missing
    // This is especially important for the ad container after page refresh
    if (!document.querySelector('.fpl-ad-container') && settings.hideAds) {
        console.log('🔍 FPL Extension: Ad container not found yet, will retry after classes are applied');
    }
}

// Toggle navigation visibility
function toggleNavigation(hide) {
    const navElement = document.querySelector('.main-navigation-wrapper');
    if (navElement) {
        navElement.style.display = hide ? 'none' : '';
        console.log('🎯 FPL Extension: Navigation display:', hide ? 'none' : 'block');
    }
}

// Toggle ad container visibility
function toggleAdContainer(hide) {
    const adContainer = document.querySelector('.fpl-ad-container');
    if (adContainer) {
        adContainer.style.display = hide ? 'none' : '';
        console.log('🎯 FPL Extension: Ad Container display:', hide ? 'none' : 'block');
    }
}

// Toggle flex layout
function toggleFlexLayout(enable) {
    const contentWrapper = document.querySelector('.fpl-content-wrapper');
    if (contentWrapper) {
        if (enable) {
            contentWrapper.style.display = 'flex';
            contentWrapper.style.flexDirection = 'row-reverse';
        } else {
            contentWrapper.style.display = '';
            contentWrapper.style.flexDirection = '';
        }
        console.log('🎯 FPL Extension: Flex layout:', enable ? 'enabled' : 'disabled');
    }
}

// Toggle retro style pitch background
function toggleRetroStyle(enable) {
    // Get the retro pitch image URL from the extension
    const retroPitchUrl = chrome.runtime.getURL('images/retro_pitch.jpg');
    
    // CSS to be injected for retro style
    let retroStyleCSS = '';
    
    // Remove any existing retro style first to ensure a clean state
    const existingStyle = document.getElementById('fpl-retro-style');
    if (existingStyle) {
        existingStyle.parentNode.removeChild(existingStyle);
    }
    
    // Find all elements with background-image containing 'pitch-graphic'
    // These could be in inline styles or in stylesheets
    if (enable) {
        console.log('🏟️ FPL Extension: Applying retro style pitch');
        
        // Create a style element for our overriding CSS
        const styleElement = document.createElement('style');
        styleElement.id = 'fpl-retro-style';
        
        // Create CSS that overrides any element with background-image containing pitch-graphic
        // Also handle elements with style property directly and any future elements
        retroStyleCSS = `
            /* Target elements with inline styles containing pitch-graphic */
            [style*="pitch-graphic"] {
                background-image: url("${retroPitchUrl}") !important;
                background-size: cover !important;
                background-position: top !important;
            }
            
            /* Target pitch elements by attribute if present */
            div[data-sponsor="default"] {
                background-image: url("${retroPitchUrl}") !important;
                background-size: cover !important;
                background-position: top !important;
            }
            
            /* Target common class names that might contain pitch background */
            .pitch, 
            .pitch-container, 
            .field, 
            .ground,
            [class*="pitch"],
            [class*="field"] {
                background-image: url("${retroPitchUrl}") !important;
                background-size: cover !important;
                background-position: top !important;
            }
            
            /* Override any background image URLs containing pitch-graphic */
            *[style*="background"] {
                background-image: url("${retroPitchUrl}") !important;
                background-size: cover !important;
                background-position: top !important;
            }
        `;
        
        styleElement.textContent = retroStyleCSS;
        document.head.appendChild(styleElement);
        
        // Also look for inline styles to replace immediately
        const elementsToCheck = [
            // Elements with style containing pitch-graphic
            ...document.querySelectorAll('[style*="pitch-graphic"]'),
            // Elements with data-sponsor="default"
            ...document.querySelectorAll('div[data-sponsor="default"]'),
            // Additional selectors for pitch elements
            ...document.querySelectorAll('.pitch, .pitch-container, .field, .ground, [class*="pitch"], [class*="field"]'),
            // Elements with any background style
            ...document.querySelectorAll('[style*="background"]')
        ];
        
        // Use a Set to remove duplicates
        const uniqueElements = [...new Set(elementsToCheck)];
        
        uniqueElements.forEach(element => {
            // Check if this element has a background image we care about
            const computedStyle = window.getComputedStyle(element);
            const backgroundImage = computedStyle.backgroundImage;
            
            if (backgroundImage && backgroundImage.includes('pitch-graphic')) {
                console.log('🔄 FPL Extension: Found element with pitch background:', element);
                element.style.backgroundImage = `url("${retroPitchUrl}")`;
                element.style.backgroundSize = 'cover';
                element.style.backgroundPosition = 'top';
                element.setAttribute('data-original-bg', backgroundImage); // Save original for restoration
            }
        });
        
        // Set up a mutation observer to catch any dynamically added elements
        setupPitchBackgroundObserver(retroPitchUrl);
        
        console.log('🏟️ FPL Extension: Retro style pitch enabled');
    } else {
        console.log('🏟️ FPL Extension: Retro style pitch disabled');
        
        // Reset elements that had inline style modifications
        const modifiedElements = document.querySelectorAll('[data-original-bg]');
        modifiedElements.forEach(element => {
            // Restore original background if we saved it
            const originalBg = element.getAttribute('data-original-bg');
            if (originalBg) {
                element.style.backgroundImage = originalBg;
                element.removeAttribute('data-original-bg');
            } else {
                // Otherwise just clear our modifications
                element.style.backgroundImage = '';
            }
            element.style.backgroundSize = '';
            element.style.backgroundPosition = '';
        });
        
        // Also remove observer if it exists
        if (window.pitchBackgroundObserver) {
            window.pitchBackgroundObserver.disconnect();
            window.pitchBackgroundObserver = null;
        }
    }
}

// Observer function to watch for dynamically added pitch elements
function setupPitchBackgroundObserver(retroPitchUrl) {
    // Disconnect existing observer if any
    if (window.pitchBackgroundObserver) {
        window.pitchBackgroundObserver.disconnect();
    }
    
    // Create a new mutation observer
    window.pitchBackgroundObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    // Check if the added node is an element
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if it has a background image containing pitch-graphic
                        const computedStyle = window.getComputedStyle(node);
                        const backgroundImage = computedStyle.backgroundImage;
                        
                        if (backgroundImage && backgroundImage.includes('pitch-graphic')) {
                            console.log('🔵 FPL Extension: New element with pitch background detected:', node);
                            node.style.backgroundImage = `url("${retroPitchUrl}")`;
                            node.style.backgroundSize = 'cover';
                            node.style.backgroundPosition = 'top';
                            node.setAttribute('data-original-bg', backgroundImage);
                        }
                        
                        // Also check any children with pitch-graphic backgrounds
                        const childrenWithBg = node.querySelectorAll('[style*="pitch-graphic"], div[data-sponsor="default"]');
                        childrenWithBg.forEach(child => {
                            const childStyle = window.getComputedStyle(child);
                            const childBg = childStyle.backgroundImage;
                            
                            if (childBg && childBg.includes('pitch-graphic')) {
                                child.style.backgroundImage = `url("${retroPitchUrl}")`;
                                child.style.backgroundSize = 'cover';
                                child.style.backgroundPosition = 'top';
                                child.setAttribute('data-original-bg', childBg);
                            }
                        });
                    }
                });
            }
        }
    });
    
    // Start observing
    window.pitchBackgroundObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Array of funny loading messages
const funnyLoadingMessages = [
    "Please wait, de-uglifying the UI",
    "Applying fantasy tactics to the interface",
    "Teaching the UI how to play a 4-3-3 formation",
    "Transferring style points to your browser",
    "Kicking the ugly styles off the pitch",
    "Benching the bad CSS, promoting the good",
    "VAR checking those layout issues",
    "Scoring design goals while you wait",
    "Subbing in some better UI elements",
    "Clean sheet loading in progress",
    "Giving the red card to layout jumping"
];

/**
 * Creates and injects the loader overlay to prevent layout jumping
 */
function createLoaderOverlay() {
    // Select a random message
    const randomMessage = funnyLoadingMessages[Math.floor(Math.random() * funnyLoadingMessages.length)];
    console.log('🎭 FPL Extension: Selected random message:', randomMessage);
    
    const overlay = document.createElement('div');
    overlay.className = 'fpl-loader-overlay';
    overlay.innerHTML = `
        <div class="fpl-loader-spinner"></div>
        <div class="fpl-loader-message">
            ${randomMessage}<span class="fpl-loader-dots"></span>
        </div>
    `;
    
    // Inject loader CSS
    const loaderCSS = document.createElement('link');
    loaderCSS.rel = 'stylesheet';
    loaderCSS.href = chrome.runtime.getURL('loader.css');
    document.head.appendChild(loaderCSS);
    
    // Add overlay to page
    document.documentElement.appendChild(overlay);
    return overlay;
}

/**
 * Removes the loader overlay with fade animation
 */
function removeLoaderOverlay(overlay) {
    if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 500); // Match the CSS transition duration
    }
}

// Create loader immediately when script loads
let loaderOverlay = createLoaderOverlay();
let currentUrl = window.location.href;
let loaderStartTime = Date.now();

/**
 * Helper function to find the closest common ancestor of two elements.
 * This is useful for finding a wrapper when you can reliably identify two elements inside it.
 * @param {Element} elem1 - The first element.
 * @param {Element} elem2 - The second element.
 * @returns {Element|null} The common ancestor element or null if not found.
 */
function findCommonAncestor(elem1, elem2) {
    if (!elem1 || !elem2) return null;
    let parent = elem1.parentElement;
    while (parent) {
        if (parent.contains(elem2)) {
            return parent;
        }
        parent = parent.parentElement;
    }
    return null;
}

function applyPersistentClasses() {
    let classesApplied = false;
    // --- 1. Identify Main Navigation (Top Bar) ---
    const mainNavAnchor = document.querySelector('header nav a[href="/my-team"]');
    if (mainNavAnchor) {
        const navContainer = mainNavAnchor.closest('header');
        if (navContainer && !navContainer.classList.contains('fpl-main-nav')) {
            navContainer.classList.add('fpl-main-nav');
            classesApplied = true;
        }
    }

    // --- 2. Identify Main Content Area (the part with the pitch) ---
    // Strategy: Find a unique, stable element inside the main area, then get its parent container.
    const pitchElement = document.querySelector('div[data-sponsor="default"]');
    let mainArea = null;
    if (pitchElement) {
        // The inner content is in a <section>. We need to target its parent <div>.
        const mainAreaSection = pitchElement.closest('section');
        if (mainAreaSection) {
            mainArea = mainAreaSection.parentElement; // This is the DIV container for the main area.
            if (mainArea && !mainArea.classList.contains('fpl-main-area')) {
                mainArea.classList.add('fpl-main-area');
                classesApplied = true;
            }
        }
    }

    // --- 3. Identify Side Bar (Player Selection & Filters) ---
    // Strategy: Find a unique, stable element inside the sidebar first.
    const searchInput = document.querySelector('input[placeholder="Search by name"]');
    let sideBar = null;
    if (searchInput) {
        // The sidebar is the <section> that contains the search input.
        sideBar = searchInput.closest('section');
        if (sideBar && !sideBar.classList.contains('fpl-side-bar')) {
            sideBar.classList.add('fpl-side-bar');
            classesApplied = true;
        }
    }
    
    // --- 4. Identify Content Wrapper and Ad Container ---
    // Strategy: The ad container and content wrapper are direct siblings of the main navigation header.
    const mainNav = document.querySelector('.fpl-main-nav');
    if (mainNav) {
        const adContainer = mainNav.nextElementSibling;
        if (adContainer && !adContainer.classList.contains('fpl-ad-container')) {
            adContainer.classList.add('fpl-ad-container');
            classesApplied = true;

            // The content wrapper is the next element after the ad container
            const contentWrapper = adContainer.nextElementSibling;
            if (contentWrapper && !contentWrapper.classList.contains('fpl-content-wrapper')) {
                contentWrapper.classList.add('fpl-content-wrapper');
                classesApplied = true;
            }
        }
    }
    
    return classesApplied;
}

// --- 6. Handle Dynamic Content with MutationObserver ---
const observer = new MutationObserver((mutationsList, observer) => {
    let debounceTimer;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        // We only need to check for the wrapper, as the function will find all children from there.
        if (!document.querySelector('.fpl-content-wrapper')) {
            const classesApplied = applyPersistentClasses();
            if (classesApplied) {
                // Apply settings after classes are applied (especially for ad container)
                applySettings();
                
                if (loaderOverlay && loaderOverlay.parentNode) {
                    removeLoaderWithDelay();
                }
            }
        }
    }, 500);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Constants for loader timing
const MINIMUM_LOADER_TIME = 1500; // Minimum 1.5 seconds display
const STABILIZATION_DELAY = 800; // Additional delay after classes applied

// Function to show loader for navigation
function showLoaderForNavigation() {
    console.log('🔄 FPL Extension: Showing loader for navigation');
    
    // Remove existing loader if present
    if (loaderOverlay && loaderOverlay.parentNode) {
        console.log('🗑️ FPL Extension: Removing existing loader');
        loaderOverlay.parentNode.removeChild(loaderOverlay);
    }
    
    // Create new loader
    console.log('✨ FPL Extension: Creating new loader for navigation');
    loaderOverlay = createLoaderOverlay();
    loaderStartTime = Date.now();
    
    // Apply classes and remove loader with delay
    setTimeout(() => {
        console.log('🎯 FPL Extension: Applying classes after navigation');
        const classesApplied = applyPersistentClasses();
        console.log('📊 FPL Extension: Classes applied:', classesApplied);
        
        // Reapply settings after classes are applied
        if (classesApplied) {
            applySettings();
        }
        
        removeLoaderWithDelay();
    }, 100); // Small delay to let navigation start
}

// Function to remove loader with proper timing
function removeLoaderWithDelay() {
    const elapsedTime = Date.now() - loaderStartTime;
    const remainingMinTime = Math.max(0, MINIMUM_LOADER_TIME - elapsedTime);
    
    setTimeout(() => {
        // Additional delay to let layout stabilize
        setTimeout(() => {
            if (loaderOverlay && loaderOverlay.parentNode) {
                removeLoaderOverlay(loaderOverlay);
            }
        }, STABILIZATION_DELAY);
    }, remainingMinTime);
}

// Initial application of classes
const initialClassesApplied = applyPersistentClasses();

// Apply settings after classes are applied (important for the ad container)
if (initialClassesApplied) {
    // Classes were applied immediately, reapply settings now that elements exist
    applySettings();
    // Still wait for stabilization
    removeLoaderWithDelay();
} else {
    // No classes applied yet, remove loader after a longer timeout
    setTimeout(() => {
        // Try applying classes one more time
        const retryClassesApplied = applyPersistentClasses();
        if (retryClassesApplied) {
            applySettings(); // Apply settings if classes were applied on retry
        }
        
        if (loaderOverlay && loaderOverlay.parentNode) {
            removeLoaderOverlay(loaderOverlay);
        }
    }, 5000); // 5 second timeout for safety
}

// --- 7. Navigation Detection for SPA ---
// Monitor URL changes to detect navigation in SPA
function detectNavigation() {
    const newUrl = window.location.href;
    console.log('🔍 FPL Extension: Checking navigation - Current:', currentUrl, 'New:', newUrl);
    
    if (newUrl !== currentUrl) {
        console.log('🚀 FPL Extension: Navigation detected! From:', currentUrl, 'To:', newUrl);
        currentUrl = newUrl;
        showLoaderForNavigation();
    } else {
        console.log('⏸️ FPL Extension: No navigation change detected');
    }
    
    // Reapply settings after navigation
    setTimeout(applySettings, 500);
}

// Override pushState and replaceState to detect programmatic navigation
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

console.log('🔧 FPL Extension: Setting up history API overrides');

history.pushState = function(...args) {
    console.log('📌 FPL Extension: pushState called with:', args);
    originalPushState.apply(history, args);
    setTimeout(detectNavigation, 0);
};

history.replaceState = function(...args) {
    console.log('🔄 FPL Extension: replaceState called with:', args);
    originalReplaceState.apply(history, args);
    setTimeout(detectNavigation, 0);
};

// Listen for popstate events (back/forward buttons)
window.addEventListener('popstate', () => {
    console.log('⬅️ FPL Extension: popstate event triggered');
    detectNavigation();
});

// Also monitor for hash changes
window.addEventListener('hashchange', () => {
    console.log('🔗 FPL Extension: hashchange event triggered');
    detectNavigation();
});

// Monitor for click events on navigation links
console.log('👁️ FPL Extension: Setting up click event monitoring');

// Directly show loader when FPL navigation links are clicked
document.addEventListener('click', (event) => {
    const target = event.target.closest('a');
    console.log('💆 FPL Extension: Click detected on:', target);
    
    if (target && target.href && target.href.includes('fantasy.premierleague.com')) {
        console.log('🔗 FPL Extension: FPL link clicked:', target.href);
        
        // Check if it's an internal navigation link (same domain)
        const targetUrl = new URL(target.href);
        const currentUrlObj = new URL(window.location.href);
        
        console.log('📍 FPL Extension: Comparing URLs - Target:', targetUrl.pathname, 'Current:', currentUrlObj.pathname);
        
        // For FPL SPA, show loader for ANY internal link click, even to same page
        // This works better for SPAs where the URL might not change but content does
        if (targetUrl.origin === currentUrlObj.origin) {
            console.log('✅ FPL Extension: Internal navigation detected, showing loader immediately');
            // Show loader immediately and start a timer to check URL changes
            showLoaderForNavigation();
            
            // Also set up a safety timeout for the original detection method
            setTimeout(detectNavigation, 50);
        } else {
            console.log('❌ FPL Extension: External navigation detected');
        }
    } else {
        console.log('ℹ️ FPL Extension: Not an FPL link or no href');
    }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateSettings') {
        console.log('🔧 FPL Extension: Updating settings', request.settings);
        
        // Update all available settings
        if (typeof request.settings.hideNavigation !== 'undefined') {
            settings.hideNavigation = request.settings.hideNavigation;
        }
        
        if (typeof request.settings.hideAds !== 'undefined') {
            settings.hideAds = request.settings.hideAds;
        }
        
        if (typeof request.settings.useFlexLayout !== 'undefined') {
            settings.useFlexLayout = request.settings.useFlexLayout;
        }
        
        applySettings();
        sendResponse({status: 'success'});
    }
    return true;
});

// Load settings on initialization
loadSettings();

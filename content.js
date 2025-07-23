// content.js
(function() {
    'use strict';

    // --- 1. Loader Functions ---

    /**
     * Injects the CSS for the loader into the document's head.
     */
    function injectLoaderCSS() {
        const style = document.createElement('style');
        style.id = 'fpl-styler-loader-styles';
        style.textContent = `
            #fpl-styler-loader {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: #ffffff; z-index: 9999999; display: flex;
                justify-content: center; align-items: center; flex-direction: column;
                transition: opacity 0.4s ease-in-out;
            }
            #fpl-styler-loader.hidden {
                opacity: 0; pointer-events: none;
            }
            #fpl-styler-loader .spinner {
                border: 8px solid #f3f3f3; border-top: 8px solid #550080;
                border-radius: 50%; width: 60px; height: 60px;
                animation: fpl-spin 1.5s linear infinite; margin-bottom: 20px;
            }
            #fpl-styler-loader .message {
                font-size: 18px; color: #333; font-family: Arial, sans-serif;
            }
            @keyframes fpl-spin {
                0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Creates and displays the loader on the page.
     */
    function showLoader() {
        if (document.getElementById('fpl-styler-loader')) return; // Don't add if already present
        const loader = document.createElement('div');
        loader.id = 'fpl-styler-loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <div class="message">Please wait, de-uglifying the UI.</div>
        `;
        document.body.appendChild(loader);
    }

    /**
     * Hides and removes the loader from the page.
     */
    function hideLoader() {
        const loader = document.getElementById('fpl-styler-loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
                const styles = document.getElementById('fpl-styler-loader-styles');
                if (styles) styles.remove();
            }, 400);
        }
    }

    // --- 2. Core Styling Logic ---

    /**
     * Applies persistent, semantic CSS classes to key layout sections of the FPL website.
     * This is the main function for styling the page.
     */
    function applyPersistentClasses() {
        let classesApplied = false;

        // Main Navigation
        const mainNavAnchor = document.querySelector('header nav a[href="/my-team"]');
        if (mainNavAnchor) {
            const navContainer = mainNavAnchor.closest('header');
            if (navContainer && !navContainer.classList.contains('fpl-main-nav')) {
                navContainer.classList.add('fpl-main-nav');
                classesApplied = true;
            }
        }

        // Main Content & Sidebar
        const pitchElement = document.querySelector('div[data-sponsor="default"]');
        if (pitchElement) {
            const mainAreaParent = pitchElement.closest('main');
            if (mainAreaParent && !mainAreaParent.classList.contains('fpl-content-wrapper')) {
                mainAreaParent.classList.add('fpl-content-wrapper');
                const children = Array.from(mainAreaParent.children).filter(el => el.tagName === 'DIV');
                if (children.length >= 2) {
                    children[0].classList.add('fpl-main-area');
                    children[1].classList.add('fpl-side-bar');
                    classesApplied = true;
                }
            }
        }

        // Ad Container
        const mainNav = document.querySelector('.fpl-main-nav');
        if (mainNav) {
            const adContainer = mainNav.nextElementSibling;
            if (adContainer && adContainer.tagName === 'DIV' && !adContainer.classList.contains('fpl-ad-container')) {
                adContainer.classList.add('fpl-ad-container');
                classesApplied = true;
            }
        }
        return classesApplied;
    }

    // --- 3. Execution and Observers ---

    // Show the loader immediately
    injectLoaderCSS();
    showLoader();

    // Run the main function and hide the loader once done
    // Use a timeout to give the page a moment to settle
    setTimeout(() => {
        applyPersistentClasses();
        hideLoader();
    }, 500);

    // Observe DOM changes for SPA navigation
    const observer = new MutationObserver((mutationsList, observer) => {
        let debounceTimer;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (applyPersistentClasses()) {
                // If new classes were applied, it might mean a page navigation
                // We don't need to do anything extra, but this confirms it ran.
            }
        }, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

(function() {
    'use strict';

    /**
     * Injects the CSS for the loader into the document's head.
     */
    function injectLoaderCSS() {
        const style = document.createElement('style');
        style.id = 'fpl-styler-loader-styles';
        style.textContent = `
            #fpl-styler-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #ffffff;
                z-index: 9999999;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                transition: opacity 0.3s ease-in-out;
            }
            #fpl-styler-loader.hidden {
                opacity: 0;
                pointer-events: none;
            }
            #fpl-styler-loader .spinner {
                border: 8px solid #f3f3f3; /* Light grey */
                border-top: 8px solid #550080; /* FPL Purple */
                border-radius: 50%;
                width: 60px;
                height: 60px;
                animation: fpl-spin 1.5s linear infinite;
                margin-bottom: 20px;
            }
            #fpl-styler-loader .message {
                font-size: 18px;
                color: #333;
                font-family: Arial, sans-serif;
            }
            @keyframes fpl-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Creates and displays the loader on the page.
     */
    function showLoader() {
        const loader = document.createElement('div');
        loader.id = 'fpl-styler-loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <div class="message">Please wait, de-uglifying the UI.</div>
        `;
        document.body.appendChild(loader);
    }

    /**
     * Hides and removes the loader from the page.
     */
    function hideLoader() {
        const loader = document.getElementById('fpl-styler-loader');
        if (loader) {
            loader.classList.add('hidden');
            // Remove the loader from the DOM after the transition ends
            setTimeout(() => {
                loader.remove();
                const styles = document.getElementById('fpl-styler-loader-styles');
                if (styles) styles.remove();
            }, 300);
        }
    }

    /**
     * Applies semantic CSS classes to the FPL layout elements.
     */
    function applyClasses() {
        // Main Navigation
        const mainNav = document.querySelector('nav[role="navigation"]');
        if (mainNav) mainNav.classList.add('fpl-main-nav');

        // Ad container (often needs to be hidden)
        const adContainer = document.querySelector('.AdSlot__AdSlotWrapper-sc-1qg1zyv-0');
        if (adContainer) adContainer.classList.add('fpl-ad-container');

        // Main content area
        const mainContent = document.querySelector('main[role="main"]');
        if (mainContent) {
            mainContent.classList.add('fpl-content-wrapper');
            const children = mainContent.children;
            if (children.length >= 2) {
                children[0].classList.add('fpl-main-area');
                children[1].classList.add('fpl-side-bar');
            }
        }
    }

    // --- Main Execution ---

    injectLoaderCSS();
    showLoader();

    // The FPL site is a single-page app, so we need to observe DOM changes.
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                applyClasses();
            }
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Apply classes on initial load and hide the loader
    // Use a timeout to ensure the DOM is ready and styles are applied
    setTimeout(() => {
        applyClasses();
        hideLoader();
    }, 500); // Adjust timeout if needed

})();

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
    // --- 1. Identify Main Navigation (Top Bar) ---
    const mainNavAnchor = document.querySelector('header nav a[href="/my-team"]');
    if (mainNavAnchor) {
        const navContainer = mainNavAnchor.closest('header');
        if (navContainer && !navContainer.classList.contains('fpl-main-nav')) {
            navContainer.classList.add('fpl-main-nav');
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
        }
    }
    
    // --- 4. Identify Content Wrapper and Ad Container ---
    // Strategy: The ad container and content wrapper are direct siblings of the main navigation header.
    const mainNav = document.querySelector('.fpl-main-nav');
    if (mainNav) {
        const adContainer = mainNav.nextElementSibling;
        if (adContainer && !adContainer.classList.contains('fpl-ad-container')) {
            adContainer.classList.add('fpl-ad-container');

            // The content wrapper is the next element after the ad container
            const contentWrapper = adContainer.nextElementSibling;
            if (contentWrapper && !contentWrapper.classList.contains('fpl-content-wrapper')) {
                contentWrapper.classList.add('fpl-content-wrapper');
            }
        }
    }
}

// --- 6. Handle Dynamic Content with MutationObserver ---
const observer = new MutationObserver((mutationsList, observer) => {
    let debounceTimer;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        // We only need to check for the wrapper, as the function will find all children from there.
        if (!document.querySelector('.fpl-content-wrapper')) {
            applyPersistentClasses();
        }
    }, 500);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

applyPersistentClasses();

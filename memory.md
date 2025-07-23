# FPL Layout Tweaker Chrome Extension - Codebase Analysis

## Overview
This Chrome extension is designed to enhance the Fantasy Premier League (FPL) website by adding persistent, semantic CSS classes to key layout sections. This allows for easier custom styling that remains stable despite changes to the website's obfuscated class names.

## File Structure

### Core Extension Files

#### 1. `manifest.json`
- **Purpose**: Extension configuration file
- **Version**: Manifest v3
- **Name**: "FPL Layout Tweaker"
- **Target**: `https://fantasy.premierleague.com/*`
- **Permissions**: `activeTab`, `scripting`
- **Content Scripts**: Injects `content.js` and `styles.css` into FPL pages

#### 2. `content.js` (3,457 bytes)
- **Purpose**: Main functionality script that identifies and applies persistent CSS classes
- **Key Features**:
  - Identifies main navigation, content areas, and sidebar elements
  - Adds semantic CSS classes for stable styling hooks
  - Uses MutationObserver for dynamic content handling
  - Implements debounced re-application to handle page changes
  
- **CSS Classes Applied**:
  - `.fpl-main-nav` - Main navigation header
  - `.fpl-ad-container` - Advertisement container
  - `.fpl-content-wrapper` - Main content wrapper
  - `.fpl-main-area` - Primary content area (pitch view)
  - `.fpl-side-bar` - Player selection and filters sidebar

- **Strategy**: Uses DOM structure analysis rather than relying on existing class names to maintain stability

#### 3. `styles.css` (933 bytes)
- **Purpose**: Basic styling and visual debugging
- **Features**:
  - Visual debugging borders with distinct colors for each section
  - Layout customizations (max-width, centering)
  - Ad container hiding (`display: none !important`)
  - Semi-transparent background colors for section identification

### Reference Files

#### 4. `my-team.html` (476,098 bytes)
- **Purpose**: Saved HTML page from FPL "My Team" section
- **Usage**: Likely used for development, testing, and understanding the DOM structure
- **Content**: Complete FPL page with all scripts, styles, and content

#### 5. `transfers.html` (392,234 bytes)
- **Purpose**: Saved HTML page from FPL transfers section
- **Usage**: Reference material for understanding different page layouts

## Technical Implementation

### DOM Identification Strategy
The extension uses a robust approach to identify layout elements:

1. **Navigation**: Finds header containing navigation link to "/my-team"
2. **Content Structure**: Uses sibling relationships to identify ad container and content wrapper
3. **Main Areas**: Uses CSS selectors with `:scope` to find direct children of content wrapper
4. **Fallback Handling**: MutationObserver ensures classes are reapplied if DOM changes

### Dynamic Content Handling
- **MutationObserver**: Monitors DOM changes with 500ms debounce
- **Conditional Reapplication**: Only reapplies classes if key elements are missing
- **Performance**: Debounced execution prevents excessive processing

## Styling Approach

### Visual Debugging
Each major section gets:
- Distinct colored borders (green, blue, pink, orange)
- Semi-transparent background colors
- `!important` declarations to override existing styles

### Layout Modifications
- **Content Wrapper**: Max-width of 1650px with auto margins for centering
- **Ad Container**: Completely hidden with `display: none !important`

## Development Notes

### Strengths
- Semantic class naming convention (`fpl-*`)
- Robust DOM identification that doesn't rely on existing class names
- Performance-conscious with debounced observers
- Clear separation of concerns between functionality and styling

### Potential Improvements
- Could add error handling for edge cases
- Might benefit from configuration options
- Could include more granular element targeting

## Usage
This extension is intended for FPL users who want to:
1. Apply custom styling to the FPL website
2. Create a more personalized layout experience
3. Hide advertisements and adjust content width
4. Have stable CSS selectors that won't break with website updates

The extension provides the foundation classes; users can then create their own custom CSS rules targeting these persistent class names.

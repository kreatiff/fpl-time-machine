# FPL Time Machine

[![Available in the Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Download-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chrome.google.com/webstore/detail/fpl-time-machine/coming-soon)

Does the new FPL website make you want to take a -32 point hit and never play the game again?

FPL Time Machine gives you the ability to go back to a better time with these features:

## Features

⚽ Centered content area  
⚽ Sidebar on the left  
⚽ Hidden global navigation  
⚽ Hidden ads  
⚽ An easy to use configurator pop-up where you can enable/disable any feature  
⚽ A cool loading screen with fun messages while you wait for the layout to fix itself

## Limitations

🛑 Only modifies on the `/my-team` and `/transfers` pages  
🛑 This is an early version so there may be bugs  
🛑 Not tested with dark mode

## Technical Details

The extension reliably identifies page elements based on the page structure without relying on CSS classes, and adds it's own CSS classes to make styling easier:
- `fpl-main-nav` - Main navigation container
- `fpl-ad-container` - Advertisement sections
- `fpl-content-wrapper` - Main content wrapper
- `fpl-main-area` - Primary content area
- `fpl-side-bar` - Sidebar elements

## Screenshots

*Coming soon*

## Feedback & Bug Reports

If you have a bug to report or a feature suggestion please submit them here: https://github.com/kreatiff/fpl-time-machine/issues
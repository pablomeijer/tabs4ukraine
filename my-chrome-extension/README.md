# Tabs4Palestine Chrome Extension

A Chrome extension to support Palestine. This extension replaces the new tab page and displays humanitarian aid ads in the bottom right corner to help raise awareness and support for Palestine.

## Features

- **New Tab Replacement**: Custom new tab page with Tabs4Palestine branding
- **Google Search Bar**: Fully functional search bar with Google integration
- **Humanitarian Ads**: Rotating ads from legitimate organizations supporting Palestine
- **Ad Placement**: Ads appear in the bottom right corner of every new tab
- **Clickable Ads**: Users can click ads to visit donation pages and learn more
- **Popup Interface**: Quick access to extension features
- **Options Page**: Extension settings and configuration
- **Side Panel**: Additional interface accessible from the browser sidebar
- **DevTools Integration**: Developer tools integration

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the extension
4. Load the `build` folder as an unpacked extension in Chrome

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview the built extension

## Structure

- `src/popup/` - Extension popup interface
- `src/newtab/` - New tab page replacement with ad component
- `src/options/` - Extension options page
- `src/sidepanel/` - Side panel interface
- `src/devtools/` - Developer tools integration
- `src/background/` - Background service worker
- `src/contentScript/` - Content scripts

## Ad Sources

The extension displays ads from legitimate humanitarian organizations supporting Palestine. See `AD_SOURCES.md` for a comprehensive list of verified organizations and how to add new ad sources.

### Current Ad Features:
- **Random Rotation**: Ads are randomly selected for each new tab
- **Clickable**: Users can click ads to visit donation pages
- **Closeable**: Users can close ads if desired
- **Responsive**: Ads adapt to different screen sizes
- **Fallback Images**: Placeholder images if external images fail to load

## License

MIT

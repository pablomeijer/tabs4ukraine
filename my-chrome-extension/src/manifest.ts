import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

// @ts-ignore
export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/ukraine_icon.png',
    32: 'img/ukraine_icon.png',
    48: 'img/ukraine_icon.png',
    128: 'img/ukraine_icon.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: {
      16: 'img/tabs4ukraine_logo.png',
      32: 'img/tabs4ukraine_logo.png',
      48: 'img/tabs4ukraine_logo.png',
      128: 'img/tabs4ukraine_logo.png',
    },
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*'],
      js: ['src/contentScript/index.ts'],
    },
  ],
  side_panel: {
    default_path: 'sidepanel.html',
  },
  web_accessible_resources: [
    {
      resources: ['img/tabs4ukraine_logo.png', 'img/icons/*'],
      matches: ['<all_urls>'],
    },
  ],
  permissions: [
    'sidePanel', 
    'storage', 
    'topSites',
    'search'
  ],
  host_permissions: [
    'https://ethicly.ch/*',
    'https://fvmpnqaoympgmrullemj.supabase.co/*',
    'https://images.unsplash.com/*'
  ],
  chrome_url_overrides: {
    newtab: 'newtab.html',
  },
  homepage_url: 'https://tabs4ukraine.framer.website/',
})
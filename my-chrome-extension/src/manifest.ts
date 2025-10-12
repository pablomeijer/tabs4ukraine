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
    16: 'img/original_watermelon.png',
    32: 'img/original_watermelon.png',
    48: 'img/original_watermelon.png',
    128: 'img/original_watermelon.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: {
      16: 'img/original_watermelon.png',
      32: 'img/original_watermelon.png',
      48: 'img/original_watermelon.png',
      128: 'img/original_watermelon.png',
    },
  },
  options_page: 'options.html',
  devtools_page: 'devtools.html',
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
      resources: ['img/original_watermelon.png', 'img/icons/*'],
      matches: ['<all_urls>'],
    },
  ],
  permissions: [
    'sidePanel', 
    'storage', 
    'topSites', 
    'bookmarks',
    'geolocation',
    'activeTab',
    'tabs'
  ],
  host_permissions: [
    'https://ethicly.ch/*',
    'https://fvmpnqaoympgmrullemj.supabase.co/*',
    'https://images.unsplash.com/*'
  ],
  chrome_url_overrides: {
    newtab: 'newtab.html',
  },
})
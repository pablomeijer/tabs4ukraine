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
    16: 'img/nobackground_watermelon.png',
    32: 'img/nobackground_watermelon.png',
    48: 'img/nobackground_watermelon.png',
    128: 'img/nobackground_watermelon.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: {
      16: 'img/nobackground_watermelon.png',
      32: 'img/nobackground_watermelon.png',
      48: 'img/nobackground_watermelon.png',
      128: 'img/nobackground_watermelon.png',
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
      resources: ['img/nobackground_watermelon.png'],
      matches: ['<all_urls>'],
    },
  ],
  permissions: ['sidePanel', 'storage'],
  chrome_url_overrides: {
    newtab: 'newtab.html',
  },
})

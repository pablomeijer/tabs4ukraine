// vite.config.ts
import { defineConfig } from "file:///C:/Users/pablo/tabs4palestine/my-chrome-extension/node_modules/vite/dist/node/index.js";
import { crx } from "file:///C:/Users/pablo/tabs4palestine/my-chrome-extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import react from "file:///C:/Users/pablo/tabs4palestine/my-chrome-extension/node_modules/@vitejs/plugin-react/dist/index.js";

// src/manifest.ts
import { defineManifest } from "file:///C:/Users/pablo/tabs4palestine/my-chrome-extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// package.json
var package_default = {
  name: "tabs4palestine",
  displayName: "Tabs4Palestine",
  version: "0.0.0",
  author: "**",
  description: "A Chrome extension to support Palestine",
  type: "module",
  license: "MIT",
  keywords: [
    "chrome-extension",
    "react",
    "vite",
    "create-chrome-ext"
  ],
  engines: {
    node: ">=14.18.0"
  },
  scripts: {
    dev: "vite",
    build: "tsc && vite build",
    preview: "vite preview",
    fmt: "prettier --write '**/*.{tsx,ts,json,css,scss,md}'",
    zip: "npm run build && node src/zip.js"
  },
  dependencies: {
    "@supabase/supabase-js": "^2.53.0",
    react: "^18.2.0",
    "react-dom": "^18.2.0"
  },
  devDependencies: {
    "@crxjs/vite-plugin": "^2.0.0-beta.26",
    "@types/chrome": "^0.0.246",
    "@types/react": "^18.2.28",
    "@types/react-dom": "^18.2.13",
    "@vitejs/plugin-react": "^4.1.0",
    gulp: "^5.0.0",
    "gulp-zip": "^6.0.0",
    prettier: "^3.0.3",
    typescript: "^5.2.2",
    vite: "^5.4.10"
  }
};

// src/manifest.ts
var isDev = process.env.NODE_ENV == "development";
var manifest_default = defineManifest({
  name: `${package_default.displayName || package_default.name}${isDev ? ` \u27A1\uFE0F Dev` : ""}`,
  description: package_default.description,
  version: package_default.version,
  manifest_version: 3,
  icons: {
    16: "img/original_watermelon.png",
    32: "img/original_watermelon.png",
    48: "img/original_watermelon.png",
    128: "img/original_watermelon.png"
  },
  action: {
    default_popup: "popup.html",
    default_icon: {
      16: "img/original_watermelon.png",
      32: "img/original_watermelon.png",
      48: "img/original_watermelon.png",
      128: "img/original_watermelon.png"
    }
  },
  options_page: "options.html",
  devtools_page: "devtools.html",
  background: {
    service_worker: "src/background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["src/contentScript/index.ts"]
    }
  ],
  side_panel: {
    default_path: "sidepanel.html"
  },
  web_accessible_resources: [
    {
      resources: ["img/original_watermelon.png", "img/icons/*"],
      matches: ["<all_urls>"]
    }
  ],
  permissions: ["sidePanel", "storage"],
  chrome_url_overrides: {
    newtab: "newtab.html"
  }
});

// vite.config.ts
var vite_config_default = defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        output: {
          chunkFileNames: "assets/chunk-[hash].js"
        }
      }
    },
    plugins: [crx({ manifest: manifest_default }), react()],
    legacy: {
      skipWebSocketTokenCheck: true
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0LnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHBhYmxvXFxcXHRhYnM0cGFsZXN0aW5lXFxcXG15LWNocm9tZS1leHRlbnNpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHBhYmxvXFxcXHRhYnM0cGFsZXN0aW5lXFxcXG15LWNocm9tZS1leHRlbnNpb25cXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3BhYmxvL3RhYnM0cGFsZXN0aW5lL215LWNocm9tZS1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuXHJcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL3NyYy9tYW5pZmVzdCdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICAgIG91dERpcjogJ2J1aWxkJyxcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvY2h1bmstW2hhc2hdLmpzJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHBsdWdpbnM6IFtjcngoeyBtYW5pZmVzdCB9KSwgcmVhY3QoKV0sXHJcbiAgICBsZWdhY3k6IHtcclxuICAgICAgc2tpcFdlYlNvY2tldFRva2VuQ2hlY2s6IHRydWUsXHJcbiAgICB9LFxyXG4gIH1cclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxwYWJsb1xcXFx0YWJzNHBhbGVzdGluZVxcXFxteS1jaHJvbWUtZXh0ZW5zaW9uXFxcXHNyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccGFibG9cXFxcdGFiczRwYWxlc3RpbmVcXFxcbXktY2hyb21lLWV4dGVuc2lvblxcXFxzcmNcXFxcbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3BhYmxvL3RhYnM0cGFsZXN0aW5lL215LWNocm9tZS1leHRlbnNpb24vc3JjL21hbmlmZXN0LnRzXCI7aW1wb3J0IHsgZGVmaW5lTWFuaWZlc3QgfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXHJcbmltcG9ydCBwYWNrYWdlRGF0YSBmcm9tICcuLi9wYWNrYWdlLmpzb24nXHJcblxyXG4vL0B0cy1pZ25vcmVcclxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnXHJcblxyXG4vLyBAdHMtaWdub3JlXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZU1hbmlmZXN0KHtcclxuICBuYW1lOiBgJHtwYWNrYWdlRGF0YS5kaXNwbGF5TmFtZSB8fCBwYWNrYWdlRGF0YS5uYW1lfSR7aXNEZXYgPyBgIFx1MjdBMVx1RkUwRiBEZXZgIDogJyd9YCxcclxuICBkZXNjcmlwdGlvbjogcGFja2FnZURhdGEuZGVzY3JpcHRpb24sXHJcbiAgdmVyc2lvbjogcGFja2FnZURhdGEudmVyc2lvbixcclxuICBtYW5pZmVzdF92ZXJzaW9uOiAzLFxyXG4gIGljb25zOiB7XHJcbiAgICAxNjogJ2ltZy9vcmlnaW5hbF93YXRlcm1lbG9uLnBuZycsXHJcbiAgICAzMjogJ2ltZy9vcmlnaW5hbF93YXRlcm1lbG9uLnBuZycsXHJcbiAgICA0ODogJ2ltZy9vcmlnaW5hbF93YXRlcm1lbG9uLnBuZycsXHJcbiAgICAxMjg6ICdpbWcvb3JpZ2luYWxfd2F0ZXJtZWxvbi5wbmcnLFxyXG4gIH0sXHJcbiAgYWN0aW9uOiB7XHJcbiAgICBkZWZhdWx0X3BvcHVwOiAncG9wdXAuaHRtbCcsXHJcbiAgICBkZWZhdWx0X2ljb246IHtcclxuICAgICAgMTY6ICdpbWcvb3JpZ2luYWxfd2F0ZXJtZWxvbi5wbmcnLFxyXG4gICAgICAzMjogJ2ltZy9vcmlnaW5hbF93YXRlcm1lbG9uLnBuZycsXHJcbiAgICAgIDQ4OiAnaW1nL29yaWdpbmFsX3dhdGVybWVsb24ucG5nJyxcclxuICAgICAgMTI4OiAnaW1nL29yaWdpbmFsX3dhdGVybWVsb24ucG5nJyxcclxuICAgIH0sXHJcbiAgfSxcclxuICBvcHRpb25zX3BhZ2U6ICdvcHRpb25zLmh0bWwnLFxyXG4gIGRldnRvb2xzX3BhZ2U6ICdkZXZ0b29scy5odG1sJyxcclxuICBiYWNrZ3JvdW5kOiB7XHJcbiAgICBzZXJ2aWNlX3dvcmtlcjogJ3NyYy9iYWNrZ3JvdW5kL2luZGV4LnRzJyxcclxuICAgIHR5cGU6ICdtb2R1bGUnLFxyXG4gIH0sXHJcbiAgY29udGVudF9zY3JpcHRzOiBbXHJcbiAgICB7XHJcbiAgICAgIG1hdGNoZXM6IFsnaHR0cDovLyovKicsICdodHRwczovLyovKiddLFxyXG4gICAgICBqczogWydzcmMvY29udGVudFNjcmlwdC9pbmRleC50cyddLFxyXG4gICAgfSxcclxuICBdLFxyXG4gIHNpZGVfcGFuZWw6IHtcclxuICAgIGRlZmF1bHRfcGF0aDogJ3NpZGVwYW5lbC5odG1sJyxcclxuICB9LFxyXG4gIHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW1xyXG4gICAge1xyXG4gICAgICByZXNvdXJjZXM6IFsnaW1nL29yaWdpbmFsX3dhdGVybWVsb24ucG5nJywgJ2ltZy9pY29ucy8qJ10sXHJcbiAgICAgIG1hdGNoZXM6IFsnPGFsbF91cmxzPiddLFxyXG4gICAgfSxcclxuICBdLFxyXG4gIHBlcm1pc3Npb25zOiBbJ3NpZGVQYW5lbCcsICdzdG9yYWdlJ10sXHJcbiAgY2hyb21lX3VybF9vdmVycmlkZXM6IHtcclxuICAgIG5ld3RhYjogJ25ld3RhYi5odG1sJyxcclxuICB9LFxyXG59KVxyXG4iLCAie1xyXG4gIFwibmFtZVwiOiBcInRhYnM0cGFsZXN0aW5lXCIsXHJcbiAgXCJkaXNwbGF5TmFtZVwiOiBcIlRhYnM0UGFsZXN0aW5lXCIsXHJcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4wLjBcIixcclxuICBcImF1dGhvclwiOiBcIioqXCIsXHJcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkEgQ2hyb21lIGV4dGVuc2lvbiB0byBzdXBwb3J0IFBhbGVzdGluZVwiLFxyXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxyXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxyXG4gIFwia2V5d29yZHNcIjogW1xyXG4gICAgXCJjaHJvbWUtZXh0ZW5zaW9uXCIsXHJcbiAgICBcInJlYWN0XCIsXHJcbiAgICBcInZpdGVcIixcclxuICAgIFwiY3JlYXRlLWNocm9tZS1leHRcIlxyXG4gIF0sXHJcbiAgXCJlbmdpbmVzXCI6IHtcclxuICAgIFwibm9kZVwiOiBcIj49MTQuMTguMFwiXHJcbiAgfSxcclxuICBcInNjcmlwdHNcIjoge1xyXG4gICAgXCJkZXZcIjogXCJ2aXRlXCIsXHJcbiAgICBcImJ1aWxkXCI6IFwidHNjICYmIHZpdGUgYnVpbGRcIixcclxuICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiLFxyXG4gICAgXCJmbXRcIjogXCJwcmV0dGllciAtLXdyaXRlICcqKi8qLnt0c3gsdHMsanNvbixjc3Msc2NzcyxtZH0nXCIsXHJcbiAgICBcInppcFwiOiBcIm5wbSBydW4gYnVpbGQgJiYgbm9kZSBzcmMvemlwLmpzXCJcclxuICB9LFxyXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcclxuICAgIFwiQHN1cGFiYXNlL3N1cGFiYXNlLWpzXCI6IFwiXjIuNTMuMFwiLFxyXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4yLjBcIixcclxuICAgIFwicmVhY3QtZG9tXCI6IFwiXjE4LjIuMFwiXHJcbiAgfSxcclxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XHJcbiAgICBcIkBjcnhqcy92aXRlLXBsdWdpblwiOiBcIl4yLjAuMC1iZXRhLjI2XCIsXHJcbiAgICBcIkB0eXBlcy9jaHJvbWVcIjogXCJeMC4wLjI0NlwiLFxyXG4gICAgXCJAdHlwZXMvcmVhY3RcIjogXCJeMTguMi4yOFwiLFxyXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjIuMTNcIixcclxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4xLjBcIixcclxuICAgIFwiZ3VscFwiOiBcIl41LjAuMFwiLFxyXG4gICAgXCJndWxwLXppcFwiOiBcIl42LjAuMFwiLFxyXG4gICAgXCJwcmV0dGllclwiOiBcIl4zLjAuM1wiLFxyXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuMi4yXCIsXHJcbiAgICBcInZpdGVcIjogXCJeNS40LjEwXCJcclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUErVSxTQUFTLG9CQUFvQjtBQUM1VyxTQUFTLFdBQVc7QUFDcEIsT0FBTyxXQUFXOzs7QUNGcVUsU0FBUyxzQkFBc0I7OztBQ0F0WDtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsYUFBZTtBQUFBLEVBQ2YsU0FBVztBQUFBLEVBQ1gsUUFBVTtBQUFBLEVBQ1YsYUFBZTtBQUFBLEVBQ2YsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsVUFBWTtBQUFBLElBQ1Y7QUFBQSxJQUNBO0FB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

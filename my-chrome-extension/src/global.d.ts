/// <reference types="vite/client" />

declare const __APP_VERSION__: string

// Chrome Extension API types
declare namespace chrome {
  namespace runtime {
    const onMessage: {
      addListener(callback: (request: any, sender: any, sendResponse: any) => void): void;
    };
    function sendMessage(message: any): void;
  }
  
  namespace storage {
    namespace local {
      function get(keys: string[], callback: (result: any) => void): void;
      function set(items: any, callback?: () => void): void;
    }
    namespace sync {
      function get(keys: string[], callback: (result: any) => void): void;
      function set(items: any, callback?: () => void): void;
    }
  }
  
  namespace devtools {
    namespace panels {
      function create(title: string, iconPath: string, pagePath: string, callback: () => void): void;
    }
  }
  
  namespace topSites {
    function get(): Promise<any[]>;
  }
  
  namespace search {
    interface QueryInfo {
      text: string;
      disposition?: 'CURRENT_TAB' | 'NEW_TAB' | 'NEW_WINDOW';
      tabId?: number;
    }
    
    function query(queryInfo: QueryInfo): Promise<void>;
  }
}

// Simple type declaration for the global puter object to avoid TS errors
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
  const puter: {
    auth: {
      signIn: () => Promise<any>;
      signOut: () => void;
      isSignedIn: () => boolean;
      getUser: () => Promise<any>;
    };
    ai: {
      chat: (prompt: string | any[], options?: any) => Promise<any>;
      txt2img: (prompt: string, options?: any) => Promise<HTMLImageElement>;
      txt2vid: (prompt: string, options?: any) => Promise<HTMLVideoElement>;
      txt2speech: (text: string, options?: any) => Promise<HTMLAudioElement>;
    };
    fs: {
      readdir: (path: string) => Promise<any[]>;
      write: (path: string, content: any) => Promise<any>;
      read: (path: string) => Promise<Blob>;
      delete: (path: string) => Promise<void>;
      mkdir: (path: string) => Promise<any>;
      move: (source: string, destination: string) => Promise<any>;
      copy: (source: string, destination: string) => Promise<any>;
    };
    kv: {
      set: (key: string, value: any) => Promise<boolean>;
      get: (key: string) => Promise<any>;
      list: () => Promise<string[]>;
      del: (key: string) => Promise<boolean>;
    };
    print: (msg: any) => void;
  };
}

export {}; // Make this a module
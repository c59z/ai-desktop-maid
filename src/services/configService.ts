import { Store } from "@tauri-apps/plugin-store";
import { invoke } from "@tauri-apps/api/core";

const STORE_NAME = "app-config.json";

class ConfigService {
  private store: Store | null = null;
  private isTauri: boolean;
  private initPromise: Promise<void>;

  constructor() {
    this.isTauri = typeof window !== "undefined" && !!(window as any).__TAURI__;
    this.initPromise = this.initStore();
  }

  private async initStore() {
    if (this.isTauri) {
      try {
        const configDir = await invoke<string>("get_app_config_dir");
        const storePath = `${configDir}/${STORE_NAME}`;
        this.store = await Store.load(storePath);
      } catch (error) {
        console.error("Failed to load store:", error);
      }
    }
  }

  async get<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    await this.initPromise;

    if (this.store) {
      try {
        const value = await this.store.get<T>(key);
        if (value !== null && value !== undefined) {
          return value;
        }
      } catch (error) {
        console.error(`Failed to get ${key} from store:`, error);
      }
    }

    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const item = localStorage.getItem(key);
        if (item !== null) {
          return JSON.parse(item) as T;
        }
      } catch (error) {
        console.error(`Failed to get ${key} from localStorage:`, error);
      }
    }

    return defaultValue;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.initPromise;

    if (this.store) {
      try {
        await this.store.set(key, value);
        await this.store.save();
      } catch (error) {
        console.error(`Failed to set ${key} in store:`, error);
      }
    }

    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to set ${key} in localStorage:`, error);
      }
    }
  }

  async delete(key: string): Promise<void> {
    await this.initPromise;

    if (this.store) {
      try {
        await this.store.delete(key);
        await this.store.save();
      } catch (error) {
        console.error(`Failed to delete ${key} from store:`, error);
      }
    }

    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to delete ${key} from localStorage:`, error);
      }
    }
  }

  async clear(): Promise<void> {
    await this.initPromise;

    if (this.store) {
      try {
        await this.store.clear();
        await this.store.save();
      } catch (error) {
        console.error("Failed to clear store:", error);
      }
    }

    if (typeof window !== "undefined" && window.localStorage) {
      try {
        localStorage.clear();
      } catch (error) {
        console.error("Failed to clear localStorage:", error);
      }
    }
  }
}

export const configService = new ConfigService();

import { LocalStorageManager } from "@/helper/storage";


const localStorageManager = new LocalStorageManager();

export class Headers {
  static Authorization() {
    const token = localStorageManager.get();

    if (token) {
      return { Authorization: `Bearer ${token}` };
    }

    return {};
  }
}

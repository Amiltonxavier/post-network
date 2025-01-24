export class LocalStorageManager {
    private key = "post.feed.token";
  
    save(token: string) {
      localStorage.setItem(this.key, JSON.stringify(token));
    }
  
    get() {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : null;
    }
  
    remove() {
      localStorage.removeItem(this.key);
    }
    clear() {
      localStorage.clear();
    }
  }
  
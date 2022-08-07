class LocalServices {
  setData(keyName = '', data: unknown = ''): void {
    const stringfyData: string = JSON.stringify(data);
    localStorage.setItem(keyName, stringfyData);
  }

  getData(keyName = '') {
    const data: string | null = localStorage.getItem(keyName);
    return data ? JSON.parse(data) : '';
  }

  stringfyData(data: unknown): string {
    return JSON.stringify(data);
  }

  clearItem(keyName = '') {
    localStorage.removeItem(keyName);
  }
}

export const localServices = new LocalServices();

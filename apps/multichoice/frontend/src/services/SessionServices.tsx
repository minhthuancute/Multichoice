class SessionStorage {
  setData(keyName = '', data: any = ''): void {
    const stringfyData: string = JSON.stringify(data);
    sessionStorage.setItem(keyName, stringfyData);
  }

  getData(keyName = ''): any {
    const data: string | null = sessionStorage.getItem(keyName);
    return data ? JSON.parse(data) : '';
  }

  stringfyData(data: any): string {
    return JSON.stringify(data);
  }

  parseData(data: any): any {
    return JSON.parse(data);
  }

  clearItem(keyName = '') {
    sessionStorage.removeItem(keyName);
  }
}

export const sessionServices = new SessionStorage();

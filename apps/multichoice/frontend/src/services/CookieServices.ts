class CookieServices {
  getCookie(cookieName: string | null) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  setCookie(cookieName: string, value: any, exdays: number) {
    const exdate = new Date();
    exdate.setTime(exdate.getTime() + exdays * 24 * 60 * 60 * 1000);
    const c_value =
      JSON.stringify(value) +
      (exdays == null ? '' : '; expires=' + exdate.toUTCString());
    document.cookie = cookieName + '=' + c_value;
  }
}

export const cookieServices = new CookieServices();

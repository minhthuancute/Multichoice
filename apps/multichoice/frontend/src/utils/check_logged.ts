import { TOKEN } from '../constants/contstants';
import { localServices } from '../services/LocalServices';
import jwtDecode from 'jwt-decode';

export const isLogin = (): boolean => {
  try {
    const token = localServices.getData(TOKEN) || '';
    const validToken = jwtDecode(token);
    return token && validToken;
  } catch (error) {
    return false;
  }
};

import { TOKEN } from '../constants/contstants';
import { localServices } from '../services/Applications/LocalServices';
import jwtDecode from 'jwt-decode';

interface ITokenPayload {
  email: string;
  exp: number;
  iat: number;
  id: number;
  username: string;
}

export const isLogin = (): boolean => {
  try {
    const token = localServices.getData(TOKEN) || '';
    const decodeToken = jwtDecode(token) as ITokenPayload;
    const isExpried = decodeToken.exp > Date.now() / 1000;
    return isExpried;
  } catch (error) {
    return false;
  }
};

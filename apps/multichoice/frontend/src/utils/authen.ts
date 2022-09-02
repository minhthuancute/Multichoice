import { TOKEN } from '../constants/contstants';
import { localServices } from '../services/LocalServices';

export const isLogin = (): boolean => {
  const token = localServices.getData(TOKEN);
  return token;
};

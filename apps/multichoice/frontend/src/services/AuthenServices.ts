import { Api } from '../utils/Api';
import { IFormLogin } from './../components/Authen/Login/FormLogin';
import { IFormRegister } from '../components/Authen/Register/FormRegister';

class AuthenServices extends Api {
  login(formData: IFormLogin) {
    const data = this.post('/auth/login', formData);
    return data;
  }

  register(formData: IFormRegister) {
    const data = this.post('/auth/register', formData);
    return data;
  }
}
export const authenServices = new AuthenServices();

import { Api } from './Api';
import { CreateUserDto } from '@monorepo/multichoice/dto';
import { LoginUserDto } from '@monorepo/multichoice/dto';

class AuthenServices extends Api {
  login(formData: LoginUserDto) {
    const data = this.post('/auth/login', formData);
    return data;
  }

  register(formData: CreateUserDto) {
    const data = this.post('/auth/register', formData);
    return data;
  }
}
export const authenServices = new AuthenServices();

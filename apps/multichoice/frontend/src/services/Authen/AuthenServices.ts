import { axiosClient } from '../Api';
import { CreateUserDto } from '@monorepo/multichoice/dto';
import { LoginUserDto } from '@monorepo/multichoice/dto';

export const authenServices = {
  login(payload: LoginUserDto) {
    const data = axiosClient.post('/auth/login', payload);
    return data;
  },

  register(payload: CreateUserDto) {
    const data = axiosClient.post('/auth/register', payload);
    return data;
  },
};

import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@errors/AppError';
import IUsersRepository from '@interfaceRepositoriesUsers/IUsersRepository';

interface IRequest {
  token: string;
}

@injectable()
export default class RefreshTokenUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<IRequest> {
    const findUser = await this.usersRepository.findById(user_id);

    if (!findUser) {
      throw new AppError('User not found', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: findUser.id,
      expiresIn,
    });

    return { token };
  }
}

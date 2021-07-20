import { isAfter, addHours } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import AppError from '@errors/AppError';
import IHashProvider from '@modelsHashProvidersUsers/IHashProvider';
import IUsersRepository from '@interfaceRepositoriesUsers/IUsersRepository';
import IUserTokensRepository from '@interfaceRepositoriesUsers/IUserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('HashProvider')
    private hasProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreateAt = userToken.created_at;
    const compareDate = addHours(tokenCreateAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await this.hasProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

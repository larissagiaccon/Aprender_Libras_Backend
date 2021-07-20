import { inject, injectable } from 'tsyringe';

import User from '@entitiesUsers/User';
import AppError from '@errors/AppError';
import IUsersRepository from '@interfaceRepositoriesUsers/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }
}

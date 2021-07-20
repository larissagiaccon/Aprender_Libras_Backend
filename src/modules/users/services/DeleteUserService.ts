import { inject, injectable } from 'tsyringe';

import User from '@entitiesUsers/User';
import AppError from '@errors/AppError';
import IUsersRepository from '@interfaceRepositoriesUsers/IUsersRepository';

@injectable()
export default class DeleteProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    await this.usersRepository.delete(user_id);

    return user;
  }
}

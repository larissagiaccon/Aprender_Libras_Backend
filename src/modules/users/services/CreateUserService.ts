import { inject, injectable } from 'tsyringe';

import User from '@entitiesUsers/User';
import AppError from '@errors/AppError';
import IHashProvider from '@modelsHashProvidersUsers/IHashProvider';
import IUsersRepository from '@interfaceRepositoriesUsers/IUsersRepository';
import ICacheProvider from '@modelsCacheProvider/ICacheProvider';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hasProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExist = await this.usersRepository.findByEmail(email);

    if (checkUserExist) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await this.hasProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

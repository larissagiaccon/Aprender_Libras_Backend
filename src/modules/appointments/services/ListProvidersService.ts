import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import User from '@entitiesUsers/User';
import IUsersRepository from '@interfaceRepositoriesUsers/IUsersRepository';
import ICacheProvider from '@modelsCacheProvider/ICacheProvider';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProviderService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    // TODO DESCOMENTAR
    // let users = await this.cacheProvider.recover<User[]>(
    //   `providers-list:${user_id}`,
    // );

    let users;

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(users),
      );
    }

    return users;
  }
}

import { container } from 'tsyringe';

import UsersRepository from '@repositoriesUsers/UsersRepository';
import IUsersRepository from '@interfaceRepositoriesUsers/IUsersRepository';

import UserTokensRepository from '@repositoriesUsers/UserTokensRepository';
import IUserTokensRepository from '@interfaceRepositoriesUsers/IUserTokensRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

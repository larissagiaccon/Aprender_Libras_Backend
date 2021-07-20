import 'reflect-metadata';

import AppError from '@errors/AppError';
import CreateUserService from '@servicesUsers/CreateUserService';
import FakeCacheProvider from '@fakesCacheProvider/FakeCacheProvider';
import FakeHashProvider from '@fakesHashProvidersUsers/FakeHashProvider';
import FakeUsersRepository from '@fakesRepositoriesUsers/FakeUsersRepository';

let createUser: CreateUserService;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    fakeUsersRepository = new FakeUsersRepository();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('name_user');
    expect(user.email).toBe('email_user@hotmail.com');
  });

  it('should not be able to create a new user with same email from another ', async () => {
    await createUser.execute({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'name_user',
        email: 'email_user@hotmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import 'reflect-metadata';

import AppError from '@errors/AppError';
import FakeHashProvider from '@fakesHashProvidersUsers/FakeHashProvider';
import AuthenticateUserService from '@servicesUsers/AuthenticateUserService';
import FakeUsersRepository from '@fakesRepositoriesUsers/FakeUsersRepository';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'email_user@hotmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'email_user@hotmail.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

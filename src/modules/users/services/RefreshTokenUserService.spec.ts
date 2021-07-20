import 'reflect-metadata';

import AppError from '@errors/AppError';
import RefreshTokenUserService from '@servicesUsers/RefreshTokenUserService';
import FakeUsersRepository from '@fakesRepositoriesUsers/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let refreshTokenUser: RefreshTokenUserService;

describe('RefreshTokenUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    refreshTokenUser = new RefreshTokenUserService(fakeUsersRepository);
  });

  it('should be able to refresh token', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    const response = await refreshTokenUser.execute(user.id);

    expect(response).toHaveProperty('token');
  });

  it('should not be able to refresh token with non existing user', async () => {
    await expect(refreshTokenUser.execute('user_id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});

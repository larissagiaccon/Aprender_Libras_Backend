import 'reflect-metadata';

import AppError from '@errors/AppError';
import UpdateProfileService from '@servicesUsers/UpdateProfileService';
import FakeHashProvider from '@fakesHashProvidersUsers/FakeHashProvider';
import FakeUsersRepository from '@fakesRepositoriesUsers/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'name_user',
      email: 'email_user@hotmail.com',
    });

    expect(updateUser.name).toBe('name_user');
    expect(updateUser.email).toBe('email_user@hotmail.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'name_user',
        email: 'email_user@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update avatar with non existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non_existing_user',
        name: 'name_user',
        email: 'email_user@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'name_user',
      email: 'email_user@hotmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updateUser.password).toBe('123123');
  });

  it('should be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'name_user',
        email: 'email_user@hotmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'name_user',
        email: 'email_user@hotmail.com',
        old_password: 'wrong_old_password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

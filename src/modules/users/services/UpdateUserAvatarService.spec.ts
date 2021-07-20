import 'reflect-metadata';

import AppError from '@errors/AppError';
import FakeStorageProvider from '@fakesStorageProvider/FakeStorageProvider';
import UpdateUserAvatarService from '@servicesUsers/UpdateUserAvatarService';
import FakeUsersRepository from '@fakesRepositoriesUsers/FakeUsersRepository';

let updateUserAvatar: UpdateUserAvatarService;
let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

describe('UpdateUserAvatarService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a new avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar with non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'not-authenticate',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete a old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'old-avatar.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: 'new-avatar.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('old-avatar.jpg');
    expect(user.avatar).toBe('new-avatar.jpg');
  });
});

import 'reflect-metadata';

import AppError from '@errors/AppError';
import ShowProfileService from '@servicesUsers/ShowProfileService';
import FakeUsersRepository from '@fakesRepositoriesUsers/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('name_user');
    expect(profile.email).toBe('email_user@hotmail.com');
  });

  it('should not be able to show the profile from a non-existing user', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

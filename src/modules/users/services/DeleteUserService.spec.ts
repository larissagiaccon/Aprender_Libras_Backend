import 'reflect-metadata';

import AppError from '@errors/AppError';
import DeleteUserService from '@servicesUsers/DeleteUserService';
import FakeUsersRepository from '@fakesRepositoriesUsers/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let deleteUser: DeleteUserService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    deleteUser = new DeleteUserService(fakeUsersRepository);
  });

  it('should be able delete the account', async () => {
    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    const user_confirm = await deleteUser.execute(user.id);

    expect(user_confirm.name).toBe('name_user');
    expect(user_confirm.email).toBe('email_user@hotmail.com');
  });

  it('should not be able to delete the account if a non-existing user', async () => {
    await expect(
      deleteUser.execute('non-existing-user-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});

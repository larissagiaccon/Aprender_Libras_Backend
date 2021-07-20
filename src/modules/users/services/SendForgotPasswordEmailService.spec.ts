import 'reflect-metadata';

import AppError from '@errors/AppError';
import FakeMailProvider from '@fakesMailProvider/FakeMailProvider';
import FakeUsersRepository from '@fakesRepositoriesUsers/FakeUsersRepository';
import FakeUserTokenRepository from '@fakesRepositoriesUsers/FakeUserTokenRepository';
import SendForgotPasswordEmailService from '@servicesUsers/SendForgotPasswordEmailService';

let fakeMailProvider: FakeMailProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'email_user@hotmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'email_user@hotmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forget password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'name_user',
      email: 'email_user@hotmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'email_user@hotmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});

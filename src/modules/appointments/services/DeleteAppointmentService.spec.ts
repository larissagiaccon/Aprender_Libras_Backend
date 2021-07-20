import 'reflect-metadata';

import AppError from '@errors/AppError';
import FakeCacheProvider from '@fakesCacheProvider/FakeCacheProvider';
import FakeAppointmentsRepository from '@fakesRepositoriesAppointments/FakeAppointmentsRepository';
import DeleteAppointmentsService from '@servicesAppointments/DeleteAppointmentService';
import FakeNotificationsRepository from '@fakesRepositoriesNotifications/FakeNotificationsRepository';

let fakeCacheProvider: FakeCacheProvider;
let deleteAppointment: DeleteAppointmentsService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('DeleteAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    deleteAppointment = new DeleteAppointmentsService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to delete the appointment', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 7, 25, 14, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 7, 25, 15, 0, 0),
    });

    expect(
      await deleteAppointment.execute({
        user_id: 'user_id',
        appointment_id: appointment2.id,
      }),
    ).toBe(undefined);
  });

  it('should not be able to delete an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 4, 10, 11),
    });

    await expect(
      deleteAppointment.execute({
        user_id: 'provider_id',
        appointment_id: appointment2.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete an appointment on a next date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2022, 4, 19, 15, 0, 0).getTime();
    });

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2022, 4, 19, 17, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2022, 4, 19, 16, 0, 0),
    });

    await expect(
      deleteAppointment.execute({
        user_id: 'provider_id',
        appointment_id: appointment2.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete an appointment if not found', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 11).getTime();
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2022, 5, 19, 15),
    });

    await deleteAppointment.execute({
      user_id: 'user_id',
      appointment_id: appointment2.id,
    });

    await expect(
      deleteAppointment.execute({
        user_id: 'provider_id',
        appointment_id: appointment2.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete an appointment if user not have permission', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 11).getTime();
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2022, 5, 19, 15),
    });

    await expect(
      deleteAppointment.execute({
        user_id: 'user_id_other',
        appointment_id: appointment2.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import { inject, injectable } from 'tsyringe';
import { isBefore, format, isEqual } from 'date-fns';

import AppError from '@errors/AppError';
import IAppointmentsRepository from '@interfaceRepositoriesAppointments/IAppointmentsRepository';
import INotificationsRepository from '@interfaceRepositoriesNotifications/INotificationsRepository';
import ICacheProvider from '@modelsCacheProvider/ICacheProvider';

interface IRequest {
  user_id: string;
  appointment_id: string;
}

@injectable()
class DeleteAppoinmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, appointment_id }: IRequest): Promise<void> {
    const findAppointment = await this.appointmentsRepository.findByID(
      appointment_id,
    );

    if (!findAppointment) {
      // console.log('Appointment not found');
      throw new AppError('Appointment not found');
    }

    const hourNow = new Date(Date.now());
    hourNow.setMinutes(0);
    hourNow.setSeconds(0);
    hourNow.setHours(hourNow.getHours() + 1);
    hourNow.setUTCMilliseconds(0);

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id: user_id,
        day: findAppointment.date.getDate(),
        month: findAppointment.date.getMonth() + 1,
        year: findAppointment.date.getFullYear(),
      },
    );

    const nextAppointment = appointments.find(appoint =>
      isEqual(appoint.date, hourNow),
    );

    // console.log('appointments: ', appointments);
    // console.log('hourNow: ', hourNow);
    // console.log('findAppointment: ', findAppointment.date);
    // console.log('nextAppointment: ', nextAppointment.date);

    if (
      findAppointment.user_id !== user_id &&
      findAppointment.provider_id !== user_id
    ) {
      // console.log('User not have permission');
      throw new AppError('User not have permission');
    }

    if (isBefore(findAppointment.date, Date.now())) {
      // console.log("You can't delete an appointment on a past date");
      throw new AppError("You can't delete an appointment on a past date.");
    }

    if (
      nextAppointment &&
      isEqual(findAppointment.date, nextAppointment.date)
    ) {
      // console.log("You can't delete an appointment on a next date");
      throw new AppError("You can't delete an appointment on a next date.");
    }

    await this.appointmentsRepository.delete(appointment_id);

    const dateFormatted = format(
      findAppointment.date,
      "dd/MM/yyyy 'às' HH:mm'h'",
    );

    await this.notificationsRepository.create({
      recipient_id: findAppointment.provider_id,
      content: `Agendamento do dia ${dateFormatted} foi cancelado.`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${findAppointment.provider_id}:${format(
        findAppointment.date,
        'yyyy-M-d',
      )}`,
    );
  }
}

export default DeleteAppoinmentService;

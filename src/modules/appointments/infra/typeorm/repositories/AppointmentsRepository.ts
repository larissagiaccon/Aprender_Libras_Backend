import { getRepository, Repository, Raw } from 'typeorm';

import Appointment from '@entitiesAppointments/Appointment';
import IAppointmentDTO from '@dtosAppointments/IAppointmentDTO';
import IFindAllInDayFromProviderDTO from '@dtosAppointments/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@dtosAppointments/IFindAllInMonthFromProviderDTO';
import IAppointmentsRepository from '@interfaceRepositoriesAppointments/IAppointmentsRepository';

export default class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByID(
    appointment_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { id: appointment_id },
    });

    return findAppointment;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments1 = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dataFielName =>
            `to_char(${dataFielName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    const appointments2 = await this.ormRepository.find({
      where: {
        user_id: provider_id,
        date: Raw(
          dataFielName =>
            `to_char(${dataFielName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments1.concat(appointments2);
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments1 = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dataFielName =>
            `to_char(${dataFielName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    const appointments2 = await this.ormRepository.find({
      where: {
        user_id: provider_id,
        date: Raw(
          dataFielName =>
            `to_char(${dataFielName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['provider'],
    });

    return appointments1.concat(appointments2);
  }

  public async delete(appointment_id: string): Promise<void> {
    await this.ormRepository
      .createQueryBuilder()
      .delete()
      .from(Appointment)
      .where({ id: appointment_id })
      .execute();
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: IAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

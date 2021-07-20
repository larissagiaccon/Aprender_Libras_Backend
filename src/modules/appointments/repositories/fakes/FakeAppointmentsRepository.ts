import { v4 as uuid } from 'uuid';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import Appointment from '@entitiesAppointments/Appointment';
import IAppointmentDTO from '@dtosAppointments/IAppointmentDTO';
import IFindAllInDayFromProviderDTO from '@dtosAppointments/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@dtosAppointments/IFindAllInMonthFromProviderDTO';
import IAppointmentsRepository from '@interfaceRepositoriesAppointments/IAppointmentsRepository';

class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByID(
    appointment_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment => appointment.id === appointment_id,
    );

    return findAppointment;
  }

  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      appointment =>
        isEqual(appointment.date, date) &&
        appointment.provider_id === provider_id,
    );

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      appointment =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month &&
        getYear(appointment.date) === year,
    );

    return appointments;
  }

  public async delete(appointment_id: string): Promise<void> {
    this.appointments = this.appointments.filter(
      appoint => appoint.id !== appointment_id,
    );
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: IAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), provider_id, user_id, date });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;

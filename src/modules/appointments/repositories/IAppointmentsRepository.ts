import Appointment from '@entitiesAppointments/Appointment';
import IAppointmentDTO from '@dtosAppointments/IAppointmentDTO';
import IFindAllInDayFromProviderDTO from '@dtosAppointments/IFindAllInDayFromProviderDTO';
import IFindAllInMonthFromProviderDTO from '@dtosAppointments/IFindAllInMonthFromProviderDTO';

export default interface IAppointmentsRepository {
  create(data: IAppointmentDTO): Promise<Appointment>;
  delete(appointment_id: string): Promise<void>;
  findByID(appointment_id: string): Promise<Appointment | undefined>;
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}

import { container } from 'tsyringe';

import AppointmentsRepository from '@repositoriesAppointments/AppointmentsRepository';
import IAppointmentsRepository from '@interfaceRepositoriesAppointments/IAppointmentsRepository';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);

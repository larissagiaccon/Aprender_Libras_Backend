import { container } from 'tsyringe';
import { Request, Response } from 'express';

import CreateAppointmentService from '@servicesAppointments/CreateAppointmentService';
import DeleteAppointmentService from '@servicesAppointments/DeleteAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, date } = request.body;
    console.log(provider_id, date);

    const createAppoinment = container.resolve(CreateAppointmentService);

    const appointment = await createAppoinment.execute({
      user_id,
      provider_id,
      date,
    });

    return response.json(appointment);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { appointment_id } = request.query;

    const deleteAppoinment = container.resolve(DeleteAppointmentService);

    const appointment = await deleteAppoinment.execute({
      user_id,
      appointment_id: String(appointment_id),
    });

    return response.json(appointment);
  }
}

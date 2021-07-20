import { container } from 'tsyringe';
import { Request, Response } from 'express';

import SendForgotPasswordService from '@servicesUsers/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordEmail = container.resolve(
      SendForgotPasswordService,
    );

    await sendForgotPasswordEmail.execute({
      email,
    });

    return response.status(204).json();
  }
}

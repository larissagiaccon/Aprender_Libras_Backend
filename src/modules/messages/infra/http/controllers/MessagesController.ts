import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';
import CreateMessageService from '@servicesMessages/CreateMessageService';
import ListByUserService from '@servicesMessages/ListByUserService';

export default class MessagesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id, text } = request.body;

    const createMessage = container.resolve(CreateMessageService);

    const message = await createMessage.execute({
      user_id,
      provider_id,
      text,
    });

    return response.json(message);
  }

  public async showByUser(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const user_id = request.user.id;
    const { provider_id } = request.body;

    const listMessages = container.resolve(ListByUserService);

    const list = await listMessages.execute(user_id, provider_id);

    return response.json(classToClass(list));
  }
}

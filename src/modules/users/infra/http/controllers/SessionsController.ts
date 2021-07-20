import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@servicesUsers/AuthenticateUserService';
import RefreshTokenUserService from '@servicesUsers/RefreshTokenUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }

  public async refresh(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const user_id = request.user.id;

    const refreshTokenUser = container.resolve(RefreshTokenUserService);

    const token = await refreshTokenUser.execute(user_id);

    return response.json(token);
  }
}

import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import ShowProfileService from '@servicesUsers/ShowProfileService';
import DeleteUserService from '@servicesUsers/DeleteUserService';
import UpdateProfileService from '@servicesUsers/UpdateProfileService';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({
      user_id,
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    return response.json(classToClass(user));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const deleteProfile = container.resolve(DeleteUserService);

    const user = await deleteProfile.execute(user_id);

    return response.json(classToClass(user));
  }
}

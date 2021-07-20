import { inject, injectable } from 'tsyringe';

import AppError from '@errors/AppError';
import Connection from '@entitiesConnections/Connection';
import IConnectionsRepository from '@interfaceRepositoriesConnections/IConnectionsRepository';

@injectable()
export default class FindByUserDescConnectionService {
  constructor(
    @inject('ConnectionsRepository')
    private connectionsRepository: IConnectionsRepository,
  ) {}

  public async execute(user_id: string): Promise<Connection> {
    const findSocket = await this.connectionsRepository.findByUserIdDesc(
      user_id,
    );

    return findSocket;
  }
}
